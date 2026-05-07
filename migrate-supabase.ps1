# Get all .ts/.tsx files, excluding node_modules and the type-only file
$files = Get-ChildItem -Recurse -Include *.ts,*.tsx |
    Where-Object { $_.FullName -notmatch 'node_modules' } |
    Where-Object { $_.FullName -notmatch 'FollowUpEmailsTab\.tsx' }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content

    # Pattern 1: Route handler client
    $content = $content -replace `
        "import \{ createRouteHandlerClient \} from ['""]@supabase/auth-helpers-nextjs['""];?", `
        "import { getServerClient } from '@/lib/supabase-server';"

    # Pattern 2: Server component client
    $content = $content -replace `
        "import \{ createServerComponentClient \} from ['""]@supabase/auth-helpers-nextjs['""];?", `
        "import { getServerClient } from '@/lib/supabase-server';"

    # Replace the instantiation block (handles both client types, with or without <Database> generic)
    $content = $content -replace `
        "(?s)const cookieStore = cookies\(\);\s*\r?\n\s*const supabase = create(?:RouteHandler|ServerComponent)Client(?:<\w+>)?\(\{\s*cookies:\s*\(\)\s*=>\s*cookieStore\s*\}\);", `
        "const supabase = await getServerClient();"

    # Also handle the inline one-liner variant: const supabase = createRouteHandlerClient({ cookies });
    $content = $content -replace `
        "const supabase = create(?:RouteHandler|ServerComponent)Client(?:<\w+>)?\(\{\s*cookies\s*\}\);", `
        "const supabase = await getServerClient();"

    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)" -ForegroundColor Green
    }
}

Write-Host "`nDone. Now check for orphan imports of 'cookies' from 'next/headers'." -ForegroundColor Yellow