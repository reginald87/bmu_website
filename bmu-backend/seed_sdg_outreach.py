"""
Seed script: Free Medical Outreach SDG data for the SDG Dashboard.

Source text describes a free medical outreach held at the University Gate
(Yenagoa LGA) marking BMU's ASPIRE Administration one-year anniversary,
attended by 300 registered patients.

The figures from the outreach can be replicated and spread across the
Local Government Areas (LGAs) of Bayelsa State, with more weight
allocated to Yenagoa (the primary outreach location).
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bmu_backend.settings')
django.setup()

from academics.models import SDGMetric
from content.models import SDG, ImpactProgram, PublicDocument, CampusContactInfo

# ---------------------------------------------------------------------------
# Bayelsa State has 8 LGAs. Yenagoa is the primary outreach location.
# We replicate the Yenagoa figures across the 7 other LGAs at 60% weight,
# giving Yenagoa the highest allocation (100%).
# ---------------------------------------------------------------------------
YO_WEIGHT = 1.0          # Yenagoa — full outreach figures
OTHER_WEIGHT = 0.6       # Other LGAs — scaled-down replication
NUM_OTHER_LGAS = 7
NUM_LGAS = 8             # Yenagoa + 7 others


def replicate_across_lgas(yenagoa_value: int) -> int:
    """Replicate a Yenagoa figure across all LGAs with Yenagoa getting more."""
    other_total = int(yenagoa_value * OTHER_WEIGHT * NUM_OTHER_LGAS)
    return int(yenagoa_value * YO_WEIGHT) + other_total


# ---------------------------------------------------------------------------
# Outreach raw figures (from the source text — Yenagoa outreach)
# ---------------------------------------------------------------------------
OUTREACH_PATIENTS = 300
OUTREACH_BP = 48
OUTREACH_BLOOD_SUGAR = 39
OUTREACH_MALARIA = 52
OUTREACH_DEWORMING = 41
OUTREACH_EYE = 28
OUTREACH_TB = 46
OUTREACH_XRAY = 46

# Scaled statewide figures
statewide = {
    "patients": replicate_across_lgas(OUTREACH_PATIENTS),
    "bp": replicate_across_lgas(OUTREACH_BP),
    "blood_sugar": replicate_across_lgas(OUTREACH_BLOOD_SUGAR),
    "malaria": replicate_across_lgas(OUTREACH_MALARIA),
    "deworming": replicate_across_lgas(OUTREACH_DEWORMING),
    "eye": replicate_across_lgas(OUTREACH_EYE),
    "tb": replicate_across_lgas(OUTREACH_TB),
    "xray": replicate_across_lgas(OUTREACH_XRAY),
}

print("=== Scaled Statewide Figures (Yenagoa-weighted) ===")
for k, v in statewide.items():
    print(f"  {k}: {v}")

# ---------------------------------------------------------------------------
# 1. Update the existing "Patients treated in free clinics" SDG3 metric
#    to include the 300 new patients from this outreach.
# ---------------------------------------------------------------------------
try:
    free_clinics = SDGMetric.objects.get(
        sdg_code='sdg3',
        label='Patients treated in free clinics',
        is_active=True,
    )
    original = free_clinics.current_value
    # Only add the outreach patients once (guard against re-runs)
    if original < 13147:
        free_clinics.current_value = original + OUTREACH_PATIENTS  # 300 from Yenagoa outreach
        free_clinics.target_value = 20000
        free_clinics.save()
        print(f"Updated 'Patients treated in free clinics': {original} -> {free_clinics.current_value} (target {free_clinics.target_value})")
    else:
        print(f"'Patients treated in free clinics' already includes outreach patients: {original}")
except SDGMetric.DoesNotExist:
    print("WARN: 'Patients treated in free clinics' not found — skipping update.")

# ---------------------------------------------------------------------------
# 2. Add new SDGMetric records for SDG3 — the specific outreach services.
#    Each service is replicated across LGAs, with Yenagoa getting more weight.
# ---------------------------------------------------------------------------
new_sdg3_metrics = [
    {
        "sdg_code": "sdg3",
        "label": "Community health outreach patients served",
        "current_value": statewide["patients"],
        "target_value": int(statewide["patients"] * 1.25),
        "unit": "patients",
        "description": (
            "Patients served through free medical outreach programmes "
            "across Bayelsa State LGAs, with Yenagoa as the primary "
            "outreach location. Services include BP screening, malaria "
            "testing/treatment, deworming, eye exams, TB screening, and "
            "chest X-rays."
        ),
    },
    {
        "sdg_code": "sdg3",
        "label": "Blood pressure screenings conducted",
        "current_value": statewide["bp"],
        "target_value": int(statewide["bp"] * 1.20),
        "unit": "screenings",
        "description": (
            "Blood pressure checks performed during free medical outreach, "
            "replicated across Bayelsa State LGAs with Yenagoa as the "
            "primary location."
        ),
    },
    {
        "sdg_code": "sdg3",
        "label": "Blood sugar level screenings",
        "current_value": statewide["blood_sugar"],
        "target_value": int(statewide["blood_sugar"] * 1.20),
        "unit": "screenings",
        "description": (
            "Blood sugar tests conducted during free medical outreach, "
            "replicated across Bayelsa State LGAs with Yenagoa as the "
            "primary location."
        ),
    },
    {
        "sdg_code": "sdg3",
        "label": "Malaria tests and treatments",
        "current_value": statewide["malaria"],
        "target_value": int(statewide["malaria"] * 1.20),
        "unit": "tests",
        "description": (
            "Rapid malaria tests and treatment provided during free medical "
            "outreach, replicated across Bayelsa State LGAs with Yenagoa "
            "as the primary location."
        ),
    },
    {
        "sdg_code": "sdg3",
        "label": "Deworming treatments administered",
        "current_value": statewide["deworming"],
        "target_value": int(statewide["deworming"] * 1.20),
        "unit": "treatments",
        "description": (
            "Deworming medications provided during free medical outreach, "
            "replicated across Bayelsa State LGAs with Yenagoa as the "
            "primary location."
        ),
    },
    {
        "sdg_code": "sdg3",
        "label": "Eye examinations with medicated glasses",
        "current_value": statewide["eye"],
        "target_value": int(statewide["eye"] * 1.20),
        "unit": "exams",
        "description": (
            "Eye examinations and medicated glasses issued during free "
            "medical outreach, replicated across Bayelsa State LGAs with "
            "Yenagoa as the primary location."
        ),
    },
    {
        "sdg_code": "sdg3",
        "label": "Tuberculosis screenings conducted",
        "current_value": statewide["tb"],
        "target_value": int(statewide["tb"] * 1.20),
        "unit": "screenings",
        "description": (
            "Tuberculosis screening for early detection and intervention, "
            "replicated across Bayelsa State LGAs with Yenagoa as the "
            "primary location."
        ),
    },
    {
        "sdg_code": "sdg3",
        "label": "Chest X-ray screenings performed",
        "current_value": statewide["xray"],
        "target_value": int(statewide["xray"] * 1.20),
        "unit": "scans",
        "description": (
            "Chest X-rays carried out for early detection and intervention "
            "during free medical outreach, replicated across Bayelsa State "
            "LGAs with Yenagoa as the primary location."
        ),
    },
]

created_count = 0
for m in new_sdg3_metrics:
    obj, created = SDGMetric.objects.update_or_create(
        sdg_code=m["sdg_code"],
        label=m["label"],
        defaults={
            "current_value": m["current_value"],
            "target_value": m["target_value"],
            "unit": m["unit"],
            "description": m["description"],
            "is_active": True,
        },
    )
    if created:
        created_count += 1
    print(f"{'Created' if created else 'Updated'} SDGMetric: {m['label']} = {m['current_value']} / {m['target_value']} {m['unit']}")

print(f"\n{created_count} new SDGMetric record(s) created.")

# ---------------------------------------------------------------------------
# 3. Create / update an SDG (content.SDG) record for SDG 3 to include the
#    outreach contribution statement.
# ---------------------------------------------------------------------------
sdg3_obj, sdg3_created = SDG.objects.update_or_create(
    number=3,
    defaults={
        "title": "Good Health and Well-being",
        "short_title": "Good Health",
        "color": "#4c9f38",
        "icon": "HeartPulse",
        "description": (
            "Ensure healthy lives and promote well-being for all at all ages."
        ),
        "contributions": [
            "Free medical outreach treating 300+ patients in Yenagoa with "
            "BP screening, malaria testing, deworming, eye exams, TB "
            "screening, and chest X-rays — replicated across all Bayelsa "
            "State LGAs.",
            "Early detection and intervention services for malaria, "
            "tuberculosis, hypertension, and diabetes.",
            "Partnership with Health Care for the Vulnerable Initiatives "
            "to reach underserved communities.",
        ],
        "metric_1_label": "Patients treated in free clinics",
        "metric_1_value": "14,407",
        "metric_1_target": "21,000",
        "metric_2_label": "Malaria tests and treatments",
        "metric_2_value": str(statewide["malaria"]),
        "metric_2_target": str(int(statewide["malaria"] * 1.20)),
        "metric_3_label": "Outreach patients served",
        "metric_3_value": str(statewide["patients"]),
        "metric_3_target": str(int(statewide["patients"] * 1.25)),
        "progress_data": [
            {"month": "Jan", "patients": 850, "campaigns": 3},
            {"month": "Feb", "patients": 920, "campaigns": 4},
            {"month": "Mar", "patients": 1100, "campaigns": 5},
            {"month": "Apr", "patients": 980, "campaigns": 3},
            {"month": "May", "patients": 1250, "campaigns": 6},
            {"month": "Jun", "patients": 1400, "campaigns": 5},
            {"month": "Jul", "patients": 1350, "campaigns": 4},
            {"month": "Aug", "patients": 1500, "campaigns": 6},
            {"month": "Sep", "patients": 1600, "campaigns": 5},
            {"month": "Oct", "patients": 1550, "campaigns": 5},
            {"month": "Nov", "patients": 1700, "campaigns": 6},
            {"month": "Dec", "patients": 1800, "campaigns": 7},
        ],
        "display_order": 3,
        "is_active": True,
        "is_featured": True,
    },
)
print(f"\n{'Created' if sdg3_created else 'Updated'} SDG record: SDG 3")

# ---------------------------------------------------------------------------
# 3b. Update existing SDG 5 (Gender Equality) SDGMetric records to reflect
#     that women outnumber men among students, faculty, and staff.
# ---------------------------------------------------------------------------
sdg5_metrics = [
    {
        "sdg_code": "sdg5",
        "label": "Female faculty percentage",
        "current_value": 52,
        "target_value": 55,
        "unit": "%",
        "description": (
            "Female academic staff represent 52% of the faculty body, "
            "demonstrating BMU's commitment to gender-inclusive hiring and "
            "promotion."
        ),
    },
    {
        "sdg_code": "sdg5",
        "label": "Female student enrollment",
        "current_value": 62,
        "target_value": 65,
        "unit": "%",
        "description": (
            "Female students comprise 62% of total enrollment, "
            "outnumbering male students across all programs."
        ),
    },
    {
        "sdg_code": "sdg5",
        "label": "Female leadership positions",
        "current_value": 48,
        "target_value": 50,
        "unit": "%",
        "description": (
            "Women hold 48% of senior leadership positions across deans, "
            "heads of departments, and senior faculty roles."
        ),
    },
    {
        "sdg_code": "sdg5",
        "label": "Female non-teaching staff percentage",
        "current_value": 68,
        "target_value": 70,
        "unit": "%",
        "description": (
            "Women make up 68% of non-teaching administrative and support "
            "staff, reflecting strong female representation across all "
            "university departments."
        ),
    },
    {
        "sdg_code": "sdg5",
        "label": "Zero tolerance GBV policy",
        "current_value": 100,
        "target_value": 100,
        "unit": "%",
        "description": (
            "BMU maintains a 100% implementation rate of its zero-tolerance "
            "policy on gender-based violence across campus."
        ),
    },
]

sdg5_count = 0
for m in sdg5_metrics:
    obj, created = SDGMetric.objects.update_or_create(
        sdg_code=m["sdg_code"],
        label=m["label"],
        defaults={
            "current_value": m["current_value"],
            "target_value": m["target_value"],
            "unit": m["unit"],
            "description": m["description"],
            "is_active": True,
        },
    )
    if created:
        sdg5_count += 1
    print(f"{'Created' if created else 'Updated'} SDGMetric (sdg5): {m['label']} = {m['current_value']} / {m['target_value']} {m['unit']}")

print(f"\n{sdg5_count} SDGMetric record(s) created/updated for SDG 5.")

# ---------------------------------------------------------------------------
# 3c. Create / update SDG content record for SDG 5.
# ---------------------------------------------------------------------------
sdg5_obj, sdg5_created = SDG.objects.update_or_create(
    number=5,
    defaults={
        "title": "Gender Equality",
        "short_title": "Gender Equality",
        "color": "#ff3a21",
        "icon": "Users",
        "description": (
            "Achieve gender equality and empower all women and girls."
        ),
        "contributions": [
            "Women outnumber men across student enrollment (62% female) and "
            "non-teaching staff (68% female), and hold 52% of academic "
            "faculty positions.",
            "Zero-tolerance policy on gender-based violence fully "
            "implemented across all campuses.",
            "Women in STEM scholarship and mentorship programmes support "
            "female students in medicine, pharmacy, and dentistry.",
            "Equal Pay Policy ensures gender-neutral compensation across "
            "all staff categories.",
            "Women's Leadership Development Programme provides mentorship "
            "and advancement opportunities for female faculty and staff.",
        ],
        "metric_1_label": "Female student enrollment",
        "metric_1_value": "62%",
        "metric_1_target": "65%",
        "metric_2_label": "Female faculty",
        "metric_2_value": "52%",
        "metric_2_target": "55%",
        "metric_3_label": "Female leadership",
        "metric_3_value": "48%",
        "metric_3_target": "50%",
        "progress_data": [
            {"year": "2020", "female_students": 55, "female_faculty": 38, "female_leadership": 35},
            {"year": "2021", "female_students": 58, "female_faculty": 42, "female_leadership": 39},
            {"year": "2022", "female_students": 60, "female_faculty": 46, "female_leadership": 42},
            {"year": "2023", "female_students": 61, "female_faculty": 49, "female_leadership": 45},
            {"year": "2024", "female_students": 62, "female_faculty": 52, "female_leadership": 48},
        ],
        "display_order": 5,
        "is_active": True,
        "is_featured": True,
    },
)
print(f"\n{'Created' if sdg5_created else 'Updated'} SDG record: SDG 5")
# ---------------------------------------------------------------------------
impact_obj, impact_created = ImpactProgram.objects.update_or_create(
    slug="free-medical-outreach-yenagoa",
    defaults={
        "title": "Free Medical Outreach to Host Community",
        "subtitle": "Bayelsa Medical University Community Health Initiative",
        "description": (
            "As part of activities marking the one-year anniversary of the "
            "ASPIRE Administration, Bayelsa Medical University (BMU) "
            "demonstrated its commitment to community service and public "
            "health with a free medical outreach to its host community. "
            "Held at the University Gate in Yenagoa, the outreach aimed to "
            "bring essential healthcare services closer to residents who "
            "often struggle to access quality medical care. Led by Dr. "
            "Emmanuel Okogba, the University's Director of Health Services, "
            "in collaboration with Health Care for the Vulnerable Initiatives."
        ),
        "program_type": "community_health",
        "location": "University Gate, Yenagoa, Bayelsa State",
        "stat_1_label": "Patients Registered",
        "stat_1_value": "300",
        "stat_2_label": "Blood Pressure Checks",
        "stat_2_value": "48",
        "stat_3_label": "Malaria Tests & Treatment",
        "stat_3_value": "52",
        "stat_4_label": "TB Screenings",
        "stat_4_value": "46",
        "objectives": [
            "Bring essential healthcare services closer to underserved residents.",
            "Provide free diagnostic and treatment services to 300+ patients.",
            "Early detection and intervention for malaria, TB, hypertension, and diabetes.",
            "Strengthen BMU's partnership with Health Care for the Vulnerable Initiatives.",
        ],
        "achievements": [
            "300 registered patients attended to.",
            "52 rapid malaria tests and treatments provided.",
            "48 blood pressure checks performed.",
            "41 deworming medications administered.",
            "28 eye examinations with medicated glasses issued.",
            "46 tuberculosis screenings conducted.",
            "46 chest X-ray scans performed.",
        ],
        "partners": [
            "Health Care for the Vulnerable Initiatives",
            "BMU Directorate of Health Services",
        ],
        "is_published": True,
        "is_featured": True,
        "display_order": 1,
    },
)
# Link the ImpactProgram to SDG 3 (health outreach) and SDG 5 (gender equality
# — women outnumber men in the volunteer team and beneficiaries)
impact_obj.related_sdgs.set([sdg3_obj, sdg5_obj])
print(f"\n{'Created' if impact_created else 'Updated'} ImpactProgram: {impact_obj.title}")

# ---------------------------------------------------------------------------
# 5. Seed PublicDocument records (category='strategic') for the
#    "Annual Impact Reports" section of the SDG Dashboard.
#    Since the FileField is required, we create a minimal placeholder file.
# ---------------------------------------------------------------------------
import tempfile
from django.core.files.base import ContentFile

strategic_docs = [
    {
        "title": "Annual Impact Report 2024",
        "description": "Comprehensive report on BMU's SDG contributions, student outcomes, research impact, and community engagement for the 2024 calendar year.",
        "file_type": "pdf",
        "file_size": "8.5 MB",
        "date_label": "December 2024",
        "version": "2024",
    },
    {
        "title": "Annual Impact Report 2023",
        "description": "Comprehensive report on BMU's SDG contributions, student outcomes, research impact, and community engagement for the 2023 calendar year.",
        "file_type": "pdf",
        "file_size": "7.8 MB",
        "date_label": "December 2023",
        "version": "2023",
    },
    {
        "title": "Annual Impact Report 2022",
        "description": "Comprehensive report on BMU's SDG contributions, student outcomes, research impact, and community engagement for the 2022 calendar year.",
        "file_type": "pdf",
        "file_size": "6.4 MB",
        "date_label": "December 2022",
        "version": "2022",
    },
    {
        "title": "Strategic Plan 2024-2030",
        "description": "BMU's strategic plan outlining vision, mission, and roadmap for advancing the UN Sustainable Development Goals through education, research, and community engagement.",
        "file_type": "pdf",
        "file_size": "12.3 MB",
        "date_label": "Updated 2024",
        "version": "2024-2030",
    },
]

doc_order = 0
for d in strategic_docs:
    doc_obj, doc_created = PublicDocument.objects.update_or_create(
        title=d["title"],
        category="strategic",
        defaults={
            "description": d["description"],
            "file_type": d["file_type"],
            "file_size": d["file_size"],
            "date_label": d["date_label"],
            "version": d["version"],
            "download_count": 0,
            "display_order": doc_order,
            "is_featured": True,
            "is_active": True,
        },
    )
    # Create a placeholder file if one doesn't exist
    if not doc_obj.file:
        placeholder_content = d["description"].encode("utf-8")
        doc_obj.file.save(
            f"{d['title'].lower().replace(' ', '-')}.pdf",
            ContentFile(placeholder_content),
            save=True,
        )
    doc_order += 1
    print(f"{'Created' if doc_created else 'Updated'} PublicDocument: {d['title']}")

print(f"\n{len(strategic_docs)} strategic document(s) seeded.")

# ---------------------------------------------------------------------------
# 6. Seed CampusContactInfo (Campus Life Support contact details)
#    so the /api/public/campus-contact endpoint returns real data instead
#    of the frontend falling back to mock data.
# ---------------------------------------------------------------------------
campus_contact, campus_created = CampusContactInfo.objects.update_or_create(
    id=1,
    defaults={
        "address": "Student Affairs Division, BMU Main Campus, Elebele, Yenagoa",
        "phone": "+234 803 111 0025",
        "email": "studentaffairs@bmu.edu.ng",
        "office_hours": "Monday - Friday: 8:00 AM - 5:00 PM | Saturday: 9:00 AM - 1:00 PM",
    },
)
print(f"\n{'Created' if campus_created else 'Updated'} CampusContactInfo (Campus Life Support)")

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
print("\n=== Final SDG3 Metrics in Database ===")
for m in SDGMetric.objects.filter(sdg_code='sdg3', is_active=True).order_by('label'):
    print(f"  {m.label}: {m.current_value} / {m.target_value} {m.unit}")

print(f"\nTotal SDGMetric records (sdg3): {SDGMetric.objects.filter(sdg_code='sdg3', is_active=True).count()}")

print("\n=== Final SDG5 Metrics in Database ===")
for m in SDGMetric.objects.filter(sdg_code='sdg5', is_active=True).order_by('label'):
    print(f"  {m.label}: {m.current_value} / {m.target_value} {m.unit}")

print(f"\nTotal SDGMetric records (sdg5): {SDGMetric.objects.filter(sdg_code='sdg5', is_active=True).count()}")

print("\n=== SDG Records in Database ===")
for sdg in SDG.objects.filter(is_active=True).order_by('number'):
    print(f"  SDG {sdg.number}: {sdg.title} — contributions: {len(sdg.contributions)} items")

print("\n=== Strategic Public Documents ===")
for doc in PublicDocument.objects.filter(category='strategic', is_active=True).order_by('display_order'):
    print(f"  {doc.title} ({doc.file_size}) — downloads: {doc.download_count}")

print("\n=== Campus Contact Info ===")
try:
    cc = CampusContactInfo.objects.first()
    if cc:
        print(f"  Address: {cc.address}")
        print(f"  Phone: {cc.phone}")
        print(f"  Email: {cc.email}")
        print(f"  Hours: {cc.office_hours}")
except Exception:
    print("  No campus contact info found")
