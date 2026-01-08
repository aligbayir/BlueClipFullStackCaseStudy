# Bildirim Merkezi (Notification Center) Projesi

Bu repo, tam kapsamlı bir bildirim sistemi çözümünü içeren **Backend** ve **Mobile** projelerini barındırır.

## Proje Yapısı

### 📂 [backend](./backend/README.md)
NestJS ile geliştirilmiş sunucu tarafı uygulamasıdır.
-   **Özellikler**: REST API, Firebase Admin SDK entegrasyonu, Auth yönetimi.
-   **Teknolojiler**: NestJS, TypeScript, Firebase Admin.
-   [Detaylı Backend Dokümantasyonu için tıklayın](./backend/README.md)

### 📂 [mobile](./mobile/README.md)
React Native (Expo) ile geliştirilmiş mobil istemci uygulamasıdır.
-   **Özellikler**: Kullanıcı girişi, bildirim listeleme, anlık bildirim alma, bildirim oluşturma.
-   **Teknolojiler**: React Native, Expo SDK, Redux Toolkit, Firebase Client SDK.
-   [Detaylı Mobile Dokümantasyonu için tıklayın](./mobile/README.md)

## Kurulum ve Çalıştırma

Her iki proje de kendi klasörleri içinde bağımsız çalıştırılabilir. Detaylı kurulum talimatları için ilgili klasördeki `README.md` dosyalarını inceleyiniz.

### Hızlı Başlangıç

1.  **Backend'i Ayağa Kaldırın**:
    ```bash
    cd backend
    npm install
    npm run start:dev
    ```

2.  **Mobile Uygulamayı Başlatın**:
    ```bash
    cd mobile
    npm install
    npx expo run:android
    ```
