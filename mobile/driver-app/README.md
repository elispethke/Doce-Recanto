# App do Motorista — Doce Encanto (preparação)

Este diretório guarda as credenciais Firebase já provisionadas para o futuro **app do motorista**
(bundle/package `com.eprox.doceencanto.driver`, projeto Firebase `doce-encanto-b6ecf`). O app em si
ainda não foi criado — este projeto (`doce-encanto`) é um site Next.js, sem estrutura nativa
Android/iOS onde esses arquivos possam residir hoje.

Quando o app do motorista for iniciado (React Native/Expo ou nativo), mova cada arquivo para o
lugar padrão da plataforma:

- `google-services.json` → raiz do módulo Android, normalmente `android/app/google-services.json`
  (Expo: também pode ser referenciado via `app.json` → `expo.android.googleServicesFile`).
- `GoogleService-Info.plist` → raiz do projeto iOS/Xcode, normalmente `ios/<NomeDoApp>/GoogleService-Info.plist`
  (Expo: `app.json` → `expo.ios.googleServicesFile`).

## Infraestrutura já pronta no backend (Firestore) para esse app consumir

- `orders/{id}` — pedidos com status, incluindo `aguardando-motorista` e `em-entrega`, e campo `driverId`.
- `drivers/{id}` — cadastro de motoristas (nome, telefone, foto, status `disponivel|ocupado|offline`).
- `chats/{orderId}/messages/{id}` — chat em tempo real por pedido, com campo `author: "admin" | "motorista"`.
- `chats/{orderId}/typing/{participantId}` — indicador de digitação, simétrico para admin e motorista.

O painel administrativo já escreve/lê nessas coleções — o app do motorista só precisa se autenticar
no mesmo projeto Firebase (Auth) e consumir as mesmas coleções com as regras de segurança adequadas
ao papel de motorista (a definir quando o app for desenvolvido).
