
<img width="1080" height="2280" alt="Screenshot_20260109_012805" src="https://github.com/user-attachments/assets/89f4f784-af3b-4c66-8ffd-1c62a866e3e3" />
<img width="1080" height="2280" alt="Screenshot_20260109_012753" src="https://github.com/user-attachments/assets/52d962eb-174f-4201-b779-e9287209972d" />
<img width="1080" height="2280" alt="Screenshot_20260109_012743" src="https://github.com/user-attachments/assets/0e7bfdff-0c44-4ee7-bfd8-1cf51b332063" />
<img width="1080" height="2280" alt="Screenshot_20260109_012812" src="https://github.com/user-attachments/assets/0e28bdc0-7826-42d4-aa10-386a592c78e3" />


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
