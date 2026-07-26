from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0018_fundedprojectimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='CampusImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('caption', models.CharField(blank=True, max_length=300)),
                ('image', models.ImageField(upload_to='campus_images/')),
                ('display_order', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Campus Image',
                'verbose_name_plural': 'Campus Images',
                'ordering': ['display_order'],
            },
        ),
    ]
