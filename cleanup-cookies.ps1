$files = Get-ChildItem -Recurse -File |
    Where-Object { $_.Extension -in '.ts', '.tsx' } |
    Where-Object { $_.FullName -notmatch 'node_modules' } |
    Where-Object { $_.FullName -notmatch 'supabase-server\.ts' }

$removed = 0
$kept = 0

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    if ($content -notmatch "import \{ cookies \} from ['""]next/headers['""];?") { continue }
    $withoutImport = $content -replace "import \{ cookies \} from ['""]next/headers['""];?\r?\n?", ""
    if ($withoutImport -match '\bcookies\b') {
        Write-Host "KEPT (still used):  $($file.FullName)" -ForegroundColor Yellow
        $kept++
    } else {
        [System.IO.File]::WriteAllText($file.FullName, $withoutImport)
        Write-Host "REMOVED import:     $($file.FullName)" -ForegroundColor Green
        $removed++
    }
}
Write-Host ""
Write-Host "Removed: $removed | Kept: $kept" -ForegroundColor Cyan
