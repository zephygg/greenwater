#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -z "${ANDROID_HOME:-}" || ! -d "$ANDROID_HOME" ]]; then
  echo "ANDROID_HOME is not set to an Android SDK." >&2
  exit 1
fi

restore_api() {
  if [[ -d /tmp/aquahydro-api && ! -d src/app/api ]]; then
    mv /tmp/aquahydro-api src/app/api
  fi
}
trap restore_api EXIT

rm -rf /tmp/aquahydro-api
mv src/app/api /tmp/aquahydro-api
NEXT_PUBLIC_APK=1 npx next build
restore_api
trap - EXIT

npx cap sync android
printf 'sdk.dir=%s\n' "$ANDROID_HOME" > android/local.properties
(cd android && ./gradlew assembleDebug)

cp android/app/build/outputs/apk/debug/app-debug.apk AquaHydro.apk
echo "Wrote AquaHydro.apk"
