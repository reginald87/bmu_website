import shutil
import tempfile
from io import BytesIO

from django.core.files.storage import default_storage, FileSystemStorage
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from PIL import Image

from content.models import PageSection, GalleryImage


class PageSectionApiTests(TestCase):
    """Public page-sections API must accept keys that contain slashes.

    Seeded keys include values like ``research/funding`` and ``centres/career``,
    so the route must allow slashes (Django's ``path`` converter).
    """

    def setUp(self):
        PageSection.objects.create(
            page_key='zztest/nested/deep', section_key='alpha',
            content_type='custom', title='Deep', data=[], display_order=1,
        )
        PageSection.objects.create(
            page_key='zztest-plain', section_key='beta',
            content_type='custom', title='Plain', data=[], display_order=1,
        )

    def test_slash_key_returns_created_row(self):
        res = self.client.get('/api/public/page-sections/zztest/nested/deep')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json()), 1)
        self.assertEqual(res.json()[0]['title'], 'Deep')

    def test_slash_key_without_rows_returns_empty(self):
        res = self.client.get('/api/public/page-sections/zztest/nested')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), [])

    def test_seeded_slash_key_returns_rows(self):
        res = self.client.get('/api/public/page-sections/research/funding')
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(len(res.json()), 1)

    def test_plain_key_returns_created_row(self):
        res = self.client.get('/api/public/page-sections/zztest-plain')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json()), 1)
        self.assertEqual(res.json()[0]['title'], 'Plain')

    def test_unknown_key_returns_empty(self):
        res = self.client.get('/api/public/page-sections/does/not/exist')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), [])


class GalleryImageThumbnailTests(TestCase):
    """GalleryImage.save must generate a thumbnail and downscale big originals."""

    def setUp(self):
        self._media_dir = tempfile.mkdtemp(prefix='bmu-test-media-')
        self._original_storage = default_storage._wrapped
        default_storage._wrapped = FileSystemStorage(location=self._media_dir)

    def tearDown(self):
        default_storage._wrapped = self._original_storage
        shutil.rmtree(self._media_dir, ignore_errors=True)

    def _make_jpeg(self, size, name='pangaea.jpg', color=(200, 30, 48)):
        img = Image.new('RGB', size, color)
        buf = BytesIO()
        img.save(buf, format='JPEG', quality=90)
        return SimpleUploadedFile(name, buf.getvalue(), content_type='image/jpeg')

    def _make_gallery(self, name='pangaea.jpg', size=(2400, 1200)):
        return GalleryImage.objects.create(
            title='Test', image=self._make_jpeg(size, name),
            category='campus', is_published=True,
        )

    def test_save_generates_thumbnail_and_downscales_original(self):
        img_obj = self._make_gallery()
        self.assertEqual(
            img_obj.thumbnail.name, 'gallery/thumbnails/pangaea_thumb.jpg',
        )
        self.assertTrue(default_storage.exists(img_obj.thumbnail.name))
        self.assertLessEqual(img_obj.thumbnail.width, 600)
        self.assertLessEqual(img_obj.thumbnail.height, 600)
        self.assertLessEqual(img_obj.image.width, 2000)
        self.assertLessEqual(img_obj.image.height, 2000)

    def test_repeat_save_is_idempotent(self):
        img_obj = self._make_gallery()
        thumb_first = img_obj.thumbnail.name
        img_obj.save()
        self.assertEqual(img_obj.thumbnail.name, thumb_first)
        self.assertTrue(default_storage.exists(thumb_first))

    def test_small_image_still_gets_thumbnail(self):
        img_obj = self._make_gallery(name='small.jpg', size=(400, 300))
        self.assertTrue(img_obj.thumbnail.name.endswith('small_thumb.jpg'))
        self.assertTrue(default_storage.exists(img_obj.thumbnail.name))
        self.assertEqual(img_obj.image.width, 400)
        self.assertEqual(img_obj.image.height, 300)

    def test_api_exposes_thumbnail_url(self):
        img_obj = self._make_gallery()
        res = self.client.get('/api/public/gallery')
        self.assertEqual(res.status_code, 200)
        payload = res.json()
        items = payload['items'] if isinstance(payload, dict) else payload
        item = next(i for i in items if i['id'] == img_obj.id)
        self.assertTrue(item['thumbnail_url'].endswith(img_obj.thumbnail.name.replace('\\', '/')))
