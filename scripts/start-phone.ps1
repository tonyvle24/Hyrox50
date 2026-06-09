$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$nodeDir = Join-Path $root '.tools\node-v22.16.0-win-x64'
$node = Join-Path $nodeDir 'node.exe'
$expoCli = Join-Path $root 'node_modules\expo\bin\cli'

$env:Path = "$nodeDir;$env:Path"
$env:HOME = $root
$env:USERPROFILE = $root
$env:EXPO_NO_TELEMETRY = '1'
$env:DOTSLASH_CACHE = Join-Path $root '.dotslash-cache'
$env:npm_config_cache = Join-Path $root '.npm-cache'

Set-Location $root
& $node $expoCli start --lan 2>&1 | Tee-Object -FilePath (Join-Path $root 'expo-phone.log')
