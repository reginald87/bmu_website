param()

$ErrorActionPreference = 'Stop'

$files = @(
    'Colleges\CollegeDetail.tsx',
    'Colleges\Colleges.tsx',
    'Impact\Community.tsx',
    'Impact\Health.tsx',
    'Impact\Impact.tsx',
    'Impact\SDGDashboard.tsx',
    'Impact\Sustainability.tsx',
    'International\Exchange.tsx',
    'International\International.tsx',
    'International\InternationalStudents.tsx',
    'International\Partnerships.tsx',
    'International\Visitors.tsx',
    'Research\Collaborations.tsx',
    'Research\FacultyProfile.tsx',
    'Research\PublicationDetail.tsx',
    'Research\Publications.tsx',
    'Research\Research.tsx',
    'Research\ResearchAndDevelopment.tsx',
    'Research\ResearchCenters.tsx',
    'Research\ResearchDetail.tsx',
    'Research\ResearchFunding.tsx',
    'Career\JobBoard.tsx',
    'Archive\Archive.tsx',
    'Gallery\Gallery.tsx',
    'Institutes\ForeignLanguages.tsx',
    'Institutes\ResearchInstitutes.tsx',
    'Centres\CareerCentre.tsx',
    'Centres\CPDCentre.tsx',
    'Centres\FoundationStudies.tsx',
    'Centres\InnovationCentre.tsx',
    'NotFound.tsx',
    'Search\Search.tsx'
)

$baseDir = 'C:\Users\Administrator\Documents\bmu-webapp\bmu-frontend\src\pages'
$totalColor = 0
$totalClass = 0
$processedCount = 0
$skippedCount = 0

# Define class removals in order (specific first to avoid substring issues)
$classPatterns = @(
    'hover:shadow-xl',
    'hover:shadow-2xl',
    'hover:shadow-lg',
    'hover:shadow-md',
    'rounded-2xl',
    'rounded-xl',
    'rounded-lg',
    'rounded-full',
    'shadow-2xl',
    'shadow-xl',
    'shadow-lg',
    'shadow-md'
)

foreach ($relative in $files) {
    $path = Join-Path $baseDir $relative
    
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        Write-Host "SKIP (not found): $relative"
        $skippedCount++
        continue
    }
    
    $content = Get-Content -LiteralPath $path -Raw -Encoding UTF8
    $origContent = $content
    
    # --- Color replacements ---
    # #9f4a83 -> #A51C30
    $count = [regex]::Matches($content, '#9f4a83').Count
    $content = $content -replace '#9f4a83', '#A51C30'
    $totalColor += $count
    
    # #0b27ac -> #1E1E1E
    $count = [regex]::Matches($content, '#0b27ac').Count
    $content = $content -replace '#0b27ac', '#1E1E1E'
    $totalColor += $count
    
    # #80fc08 -> #A51C30
    $count = [regex]::Matches($content, '#80fc08').Count
    $content = $content -replace '#80fc08', '#A51C30'
    $totalColor += $count
    
    # #003366 -> #1E1E1E
    $count = [regex]::Matches($content, '#003366').Count
    $content = $content -replace '#003366', '#1E1E1E'
    $totalColor += $count
    
    # --- Class removals ---
    $prevContent = $content
    foreach ($class in $classPatterns) {
        # Remove class when preceded by word boundary/space and followed by space/quote/end
        $escaped = [regex]::Escape($class)
        # Match: whitespace + class + (whitespace or quote or end)
        $content = [regex]::Replace($content, "(?<=\s)$escaped(?=\s|'|""|`)", '')
    }
    
    # Handle plain `rounded` - only when not followed by `-` (to avoid matching rounded-xl etc)
    $content = [regex]::Replace($content, "(?<=\s)rounded(?!-)(?=\s|'|""|`)", '')
    
    # Count class removals
    if ($content -ne $prevContent) {
        # Count by difference in string length - approximate
        $totalClass += [regex]::Matches($origContent, '(?<=\s)(?:hover:shadow-xl|hover:shadow-2xl|hover:shadow-lg|hover:shadow-md|rounded-2xl|rounded-xl|rounded-lg|rounded-full|shadow-2xl|shadow-xl|shadow-lg|shadow-md|rounded(?!-))(?=\s)').Count - [regex]::Matches($content, '(?<=\s)(?:hover:shadow-xl|hover:shadow-2xl|hover:shadow-lg|hover:shadow-md|rounded-2xl|rounded-xl|rounded-lg|rounded-full|shadow-2xl|shadow-xl|shadow-lg|shadow-md|rounded(?!-))(?=\s)').Count
    }
    
    # --- Clean up double spaces ---
    $content = $content -replace '  +', ' '
    
    # Only write if content changed
    if ($content -ne $origContent) {
        Set-Content -LiteralPath $path -Value $content -Encoding UTF8 -NoNewline
    }
    
    Write-Host "DONE: $relative"
    $processedCount++
}

Write-Host "`n=== SUMMARY ==="
Write-Host "Files processed: $processedCount"
Write-Host "Files skipped: $skippedCount"
Write-Host "Total color replacements: $totalColor"
Write-Host "Total class removals: $totalClass"
Write-Host "Total transformations: $($totalColor + $totalClass)"
