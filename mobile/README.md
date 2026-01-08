# Mobile - Bildirim Merkezi (React Native)

Bu proje, Bildirim Merkezi örnek çalışmasının mobil istemcisidir. **React Native (Expo)** kullanılarak, kusursuz kullanıcı deneyimi, kalıcı kimlik doğrulama ve kararlı anlık bildirim yönetimi odaklı olarak geliştirilmiştir.

## Teknolojiler ve Paketler

-   **Çatı (Framework)**: [Expo](https://expo.dev/) (SDK 54) üzerinden [React Native](https://reactnative.dev/)
-   **Durum Yönetimi (State Management)**: `Redux Toolkit` (v2.5.0+) & `React-Redux` (v9.2.0)
    -   Global state yönetimi ve asenkron veri akışı için endüstri standardı.
-   **Veri Getirme**: `RTK Query` (Redux Toolkit içine entegre)
    -   API isteklerini, caching (önbellekleme) ve invalidation (veriyi bayatlatma) süreçlerini otomatik yönetir.
-   **Kalıcılık (Persistence)**: `redux-persist` (v6.0.0) & `AsyncStorage`
    -   Kullanıcı oturumunun (token) uygulama kapatılıp açılsa bile korunmasını sağlar.
-   **Navigasyon**: `React Navigation` (v7)
-   **Bildirimler**: `expo-notifications`
-   **Kimlik Doğrulama**: `firebase` (v12.7.0) istemci SDK'sı

## Klasör Yapısı (Best Practices)

Proje, ölçeklenebilir ve özellik odaklı (feature-based) bir yapı kullanır:

-   `src/api/`: RTK Query tanımları (`apiSlice.ts`). Tüm backend istekleri burada tanımlıdır.
-   `src/hooks/`: UI'dan mantığı soyutlamak için özel hook'lar (`useAuth`, `useNotifications`).
-   `src/services/`: Harici entegrasyonlar. `FirebaseMessagingService.ts` burada bulunur ve push token alma/dinleme işlemlerini yönetir.
-   `src/store/`: Redux konfigürasyonu (`store.ts`) ve slice dosyaları (`authSlice.ts`).
-   `src/screens/`: Kullanıcı arayüzü ekranları.
-   `src/components/`: Yeniden kullanılabilir bileşenler (`TokenManager`, `NotificationObserver`).
-   `src/theme/`: Global tema ve renk paleti (`AppTheme.ts`).
-   `src/navigation/`: Navigasyon yığınları (`AppNavigator`, `AuthStack`, `AppStack`).

## Ekranlar ve Fonksiyonları

Uygulama aşağıdaki temel ekranlardan oluşur:

### 1. Login Screen (`LoginScreen.tsx`)
-   **Amaç**: Kullanıcının e-posta ve şifre ile giriş yapmasını sağlar.
-   **İşlev**:
    -   Firebase Authentication ile kullanıcıyı doğrular.
    -   Başarılı girişte alınan token'ı Redux Store'a ve `AsyncStorage`'a kaydeder.
    -   "Don't have an account?" bağlantısı ile kayıt ekranına yönlendirir.

### 2. Register Screen (`RegisterScreen.tsx`)
-   **Amaç**: Yeni kullanıcı kaydı oluşturur.
-   **İşlev**:
    -   E-posta, Şifre ve Şifre Tekrarı alanlarını içerir.
    -   İstemci tarafında şifre eşleşme kontrolü yapar.
    -   Kayıt başarılı olduğunda otomatik olarak uygulamaya giriş yapar.

### 3. Notification List (`NotificationListScreen.tsx`)
-   **Amaç**: Kullanıcının geçmiş bildirimlerini listeler.
-   **İşlev**:
    -   **Listeleme**: RTK Query ile backend'den çekilen bildirimleri listeler.
    -   **Arama**: Başlıkta yer alan arama çubuğu ile bildirimler arasında filtreleme yapar.
    -   **Görünüm**: Sadeleştirilmiş kart yapısı kullanır; "Detail" ikonu veya karmaşık statüler kaldırılmıştır.
    -   **FAB (Floating Action Button)**: Sağ alttaki (+) butonu ile yeni bildirim oluşturma ekranına yönlendirir.
    -   **Logout**: Sağ üstteki çıkış ikonu ile oturumu sonlandırır.

### 4. Create Notification (`CreateNotificationScreen.tsx`)
-   **Amaç**: Yeni bir bildirim oluşturup backend'e (ve dolayısıyla kendisine/diğer cihazlara) gönderir.
-   **İşlev**:
    -   **Başlık ve İçerik**: Kullanıcıdan bildirim başlığı ve metnini alır.
    -   **Sadelik**: Öncelik (Priority) ve Zamanlama (Schedule) özellikleri kaldırılarak sadece anlık gönderime odaklanılmıştır.
    -   **Onay**: Sağ üstteki "Check" ikonu veya alttaki "Create" butonu ile bildirimi gönderir.

## Kimlik Doğrulama ve Token Mantığı (Senior Seviye)

Uygulama, Firebase token'larının 1 saatlik kısa ömrünü kullanıcıya hissettirmeden yöneten sağlam bir **Otomatik Yenileme (Auto-Refresh)** mekanizmasına sahiptir:

1.  **Redux Persist**: Kimlik doğrulama token'ı `redux-persist` ile yerel depolamada saklanır.
2.  **Interceptor (`baseQueryWithReauth`)**:
    -   Tüm API istekleri `apiSlice.ts` içindeki özel bir interceptor'dan geçer.
    -   Eğer bir istek `401 Unauthorized` hatası alırsa, interceptor bunu yakalar.
    -   Firebase SDK'sı üzerinden sessizce yeni bir token alınır (`getIdToken(true)`).
    -   Orijinal istek yeni token ile **otomatik olarak tekrar denenir**.

## Kurulum ve Çalıştırma

### Ön Hazırlık
1.  **Node.js**: Sisteminizde Node.js yüklü olmalıdır.
2.  **Dosyalar**:
    -   `google-services.json` dosyasını (Firebase Console'dan indirin) projenin kök dizinine (`c:\dev\mobile\`) yerleştirin. Bu, Android bildirimleri için zorunludur.

### Adım Adım Çalıştırma

1.  **Bağımlılıkları Yükleyin**:
    Terminalde proje dizinindeyken:
    ```bash
    npm install
    ```

2.  **Android Uygulamasını Başlatın**:
    Firebase ve Notification özellikleri için "Development Build" önerilir (Expo Go bazı native özellikleri kısıtlayabilir).
    ```bash
    npx expo run:android
    ```
    *Not: Bu komut Android Studio emülatörünü veya bağlı bir Android cihazı gerektirir.*

3.  **Alternatif (Expo Go)**:
    Eğer sadece UI geliştirmesi yapacaksanız:
    ```bash
    npx expo start
    ```
    Komutunu kullanıp `a` tuşuna basabilirsiniz. Ancak Push Notification özellikleri Expo Go'da tam çalışmayabilir.
