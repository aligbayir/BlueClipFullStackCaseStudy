# Backend - Bildirim Merkezi (NestJS)

Bu proje, Bildirim Merkezi örnek çalışmasının backend servisidir. Kimlik doğrulama ve anlık bildirim işlemlerini yönetmek için **NestJS** ile ölçeklenebilir ve modüler bir mimaride geliştirilmiştir.

## Teknolojiler ve Paketler

-   **Çatı (Framework)**: [NestJS](https://nestjs.com/) (v11.0.1)
-   **Dil**: TypeScript (v5.7.3)
-   **Kimlik Doğrulama & Bildirimler**: `firebase-admin` (v13.6.0)
-   **Doğrulama (Validation)**: `class-validator` & `class-transformer`
-   **Araçlar**: `uuid` (Bellek içi ID üretimi için)
-   **Test**: `jest` & `supertest`

## Mimari Yapı

Proje, **katı bir katmanlı mimari (strict layered architecture)** izler:

1.  **Controller'lar** (`notifications.controller.ts`): Gelen HTTP isteklerini karşılar ve veri doğrulamasını yapar.
2.  **Servisler** (`notifications.service.ts`): İş mantığını (CRUD işlemleri, Firebase ile iletişim) barındırır.
3.  **Guard'lar** (`auth.guard.ts`): Korunan uç noktalara (endpoint) gelen isteklerde Firebase ID Token doğrulaması yapar.
4.  **Decorator'lar** (`get-user.decorator.ts`): İsteklerden kimliği doğrulanmış kullanıcı bilgilerini ayrıştırmak için kullanılan özel decorator.

## Kimlik Doğrulama ve Token Mantığı

Backend, **Firebase Authentication** altyapısına güvenir.

1.  **Durumsuz (Stateless) Kimlik Doğrulama**: Backend herhangi bir şifre saklamaz veya oturum yönetmez.
2.  **Auth Guard**:
    -   Korunan rotalara gelen istekleri yakalar.
    -   `Authorization` başlığındaki "Bearer" token'ı okur.
    -   `firebase-admin.auth().verifyIdToken()` kullanarak token'ın geçerliliğini ve imzasını doğrular.
    -   Geçerliyse, çözümlenen kullanıcı objesini `request.user` içine ekler.

## API Uç Noktaları (Endpoints)

### Bildirimler

-   `GET /notifications`: Kimliği doğrulanmış kullanıcının bildirim listesini getirir.
-   `POST /notifications`: Yeni bir bildirim oluşturur (ve gönderimi tetikler).
    -   **Gövde (Body)**: `{ "title": "...", "body": "..." }`
-   `POST /notifications/register-token`: Kullanıcı için bir FCM cihaz token'ı kaydeder.
-   `POST /notifications/send`: FCM üzerinden gerçek bir anlık bildirim gönderimini tetikler (Test amaçlı).

## Kurulum ve Çalıştırma

1.  **Bağımlılıkları Yükleyin**:
    ```bash
    npm install
    ```

2.  **Firebase Konfigürasyonu**:
    -   Firebase Konsolu'ndan indirdiğiniz `serviceAccountKey.json` dosyasını ana dizine (root) yerleştirin.
    -   Alternatif olarak `GOOGLE_APPLICATION_CREDENTIALS` ortam değişkenini ayarlayabilirsiniz.

3.  **Geliştirme Sunucusunu Başlatın**:
    ```bash
    npm run start:dev
    ```
    Sunucu `http://localhost:3000` adresinde çalışmaya başlayacaktır.

## Testler

Servisler ve controller'lar için birim testlerini (unit tests) çalıştırın:

```bash
npm test
```
