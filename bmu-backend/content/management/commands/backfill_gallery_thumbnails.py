from django.core.management.base import BaseCommand, CommandError

from content.models import GalleryImage


class Command(BaseCommand):
    help = "Generate thumbnails (and downscale oversized originals) for gallery images."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help=(
                "Re-encode every image even when it is already within the "
                "size limits."
            ),
        )

    def handle(self, *args, **options):
        qs = GalleryImage.objects.all().order_by('id')
        if not qs.exists():
            self.stdout.write(self.style.WARNING("No gallery images found."))
            return
        for obj in qs:
            try:
                obj.save(force=options['force'])
            except Exception as exc:  # pragma: no cover - defensive
                raise CommandError(f"Failed to process {obj!r}: {exc}")
        self.stdout.write(
            self.style.SUCCESS(f"Processed {qs.count()} gallery images.")
        )