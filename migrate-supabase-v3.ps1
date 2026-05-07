# Use -LiteralPath-friendly enumeration that doesn't choke on [ ] in folder names
$files = Get-ChildItem -Recurse -File |
    Where-Object { $_.Extension -in '.ts', '.tsx' } |
    Where-Object { $_.FullName -notmatch 'node_modules' } |
    Where-Object { $_.FullName -notmatch 'FollowUpEmailsTab\.tsx' }

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $original = $content

    $content = $content -replace `
        "import \{ createRouteHandlerClient \} from ['""]@supabase/auth-helpers-nextjs['""];?", `
        "import { getServerClient } from '@/lib/supabase-server';"

    $content = $content -replace `
        "import \{ createServerComponentClient \} from ['""]@supabase/auth-helpers-nextjs['""];?", `
        "import { getServerClient } from '@/lib/supabase-server';"

    $content = $content -replace `
        "(?s)const cookieStore = cookies\(\);\s*\r?\n\s*const supabase = create(?:RouteHandler|ServerComponent)Client(?:<\w+>)?\(\{\s*cookies:\s*\(\)\s*=>\s*cookieStore\s*\}\);", `
        "const supabase = await getServerClient();"

    $content = $content -replace `
        "const supabase = create(?:RouteHandler|ServerComponent)Client(?:<\w+>)?\(\{\s*cookies\s*\}\);", `
        "const supabase = await getServerClient();"

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content)
        Write-Host "Updated: $($file.FullName)" -ForegroundColor Green
    }
}

Write-Host "`nDone." -ForegroundColor Yellow