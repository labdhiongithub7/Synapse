# Parse the commit data from GitHub API
$response = Invoke-RestMethod -Uri "https://api.github.com/repos/code-with-antonio/nodebase/commits?author=AntonioErdeljac&per_page=100" -Headers @{"User-Agent"="PowerShell"}

$commits = $response | ForEach-Object {
    [PSCustomObject]@{
        SHA = $_.sha.Substring(0,8)
        FullSHA = $_.sha
        Message = $_.commit.message.Split("`n")[0]
        Date = $_.commit.author.date
    }
}

Write-Host "Total commits: $($commits.Count)"
Write-Host ""
Write-Host "All commits (newest first):"
Write-Host "---"
$i = 1
foreach ($c in $commits) {
    Write-Host "$i. [$($c.SHA)] $($c.Message) ($($c.Date))"
    $i++
}

# The commit numbers in messages go from 30 down to 1
# "14th commit" - need to identify which one that is
Write-Host ""
Write-Host "---"
Write-Host "Commits with their tutorial number (from commit message):"
foreach ($c in $commits) {
    if ($c.Message -match "^(\d+):") {
        Write-Host "Tutorial #$($Matches[1]): $($c.Message) - SHA: $($c.FullSHA)"
    }
}
