#!/usr/bin/env bash
# firebase-tools >= 14 requer JDK 21+ para o emulador do Firestore, mas o
# JAVA_HOME padrão desta máquina aponta para o JDK 17. Este script localiza um
# JDK 21+ instalado e o coloca na frente do PATH só para este processo, sem
# alterar a configuração global do sistema.
set -euo pipefail

if command -v /usr/libexec/java_home >/dev/null 2>&1; then
  JDK21=$(/usr/libexec/java_home -v 21+ 2>/dev/null || true)
  if [ -n "$JDK21" ]; then
    export JAVA_HOME="$JDK21"
    export PATH="$JAVA_HOME/bin:$PATH"
  fi
fi

exec firebase emulators:start --only auth,firestore --project doce-encanto-b6ecf "$@"
