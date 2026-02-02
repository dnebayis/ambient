# Deployment Guide - Ambient Simulation

Bu döküman, Ambient Blockchain Simulation projesini GitHub ve Vercel'e deploy etmek için gerekli tüm adımları içerir.

## Önemli Notlar

- **API Key Opsiyoneldir**: Uygulama API key olmadan demo modda çalışır
- **Public API Kullanımı**: Ambient'in public API endpoints'leri kullanılır ([api.ambient.xyz](https://api.ambient.xyz))
- **Ücretsiz Deployment**: Vercel'in ücretsiz planı yeterlidir

---

## 1. GitHub'a Yükleme

### Adım 1: Repository Oluşturma

1. [github.com](https://github.com) adresine gidin
2. "New repository" butonuna tıklayın
3. Repository bilgilerini girin:
   - **Name**: `ambient-simulation` (veya istediğiniz bir isim)
   - **Description**: "Interactive simulation of Ambient - AI-powered blockchain"
   - **Visibility**: Public veya Private (tercihinize göre)
   - ⚠️ **Initialize** seçeneklerini işaretlemeyin (README, .gitignore, license)
4. "Create repository" butonuna tıklayın

### Adım 2: Kodu GitHub'a Push Etme

Terminal'de proje klasöründeyken:

```bash
# Dosyaları staging area'ya ekle
git add .

# İlk commit'i oluştur
git commit -m "Initial commit: Ambient blockchain simulation"

# Main branch'i ayarla
git branch -M main

# GitHub repository'yi remote olarak ekle (URL'i kendi repo URL'iniz ile değiştirin)
git remote add origin https://github.com/KULLANICI_ADINIZ/ambient-simulation.git

# Kodu GitHub'a push et
git push -u origin main
```

**Not**: `KULLANICI_ADINIZ` ve repository adını kendi bilgilerinizle değiştirin.

---

## 2. Vercel'e Deploy Etme

### Yöntem 1: Otomatik Deploy (Önerilen)

1. **Vercel'e Giriş Yapın**
   - [vercel.com](https://vercel.com) adresine gidin
   - GitHub hesabınızla giriş yapın

2. **Yeni Proje Oluşturun**
   - "Add New..." → "Project" seçeneğine tıklayın
   - GitHub repository'nizi listeden seçin
   - "Import" butonuna tıklayın

3. **Proje Ayarları**
   Vercel otomatik olarak Next.js'i algılayacak ve şu ayarları yapacaktır:

   - **Framework Preset**: Next.js
   - **Root Directory**: `ambient-simulation`
   - **Build Command**: `npm run build` (otomatik)
   - **Output Directory**: `.next` (otomatik)
   - **Install Command**: `npm install` (otomatik)

4. **Environment Variables (Opsiyonel)**

   API key kullanmak isterseniz:
   - "Environment Variables" bölümünü açın
   - Key: `NEXT_PUBLIC_AMBIENT_API_KEY`
   - Value: Ambient API key'inizi girin ([api.ambient.xyz](https://api.ambient.xyz) adresinden alabilirsiniz)
   - "Add" butonuna tıklayın

5. **Deploy**
   - "Deploy" butonuna tıklayın
   - Yaklaşık 2-3 dakika içinde deploy tamamlanacak
   - Vercel size bir production URL verecek (örn: `ambient-simulation.vercel.app`)

### Yöntem 2: Vercel CLI ile Deploy

```bash
# Vercel CLI'yi global olarak yükle (ilk defa yapıyorsanız)
npm install -g vercel

# Vercel'e giriş yap
vercel login

# Proje dizinine git
cd ambient-simulation

# Deploy et
vercel

# Production'a deploy et
vercel --prod
```

---

## 3. Deployment Sonrası Kontroller

### Doğrulama Checklist

- [ ] Ana sayfa açılıyor mu?
- [ ] 3D visualizations render oluyor mu?
- [ ] Navigation menüsü çalışıyor mu?
- [ ] Responsive tasarım mobilde düzgün görünüyor mu?
- [ ] API key varsa, chat playground çalışıyor mu?
- [ ] Model dashboard yükleniyor mu?

### Production URL'i Kontrol

Vercel deploy sonrasında size bir URL verecek:
```
https://your-project-name.vercel.app
```

Bu URL'i tarayıcınızda açarak uygulamanızı test edin.

---

## 4. Domain Bağlama (Opsiyonel)

Kendi domain'inizi kullanmak isterseniz:

1. Vercel Dashboard'da projenizi açın
2. "Settings" → "Domains" seçeneğine gidin
3. Domain adınızı girin (örn: `ambient.example.com`)
4. Vercel size DNS ayarlarını gösterecek
5. Domain sağlayıcınızın panelinden DNS kayıtlarını ekleyin:
   - Type: `CNAME`
   - Name: `ambient` (veya subdomain'iniz)
   - Value: `cname.vercel-dns.com`

---

## 5. Sürekli Deployment (CI/CD)

GitHub ile Vercel entegrasyonu sayesinde:

- ✅ `main` branch'e her push otomatik deploy olur
- ✅ Pull request'ler için preview URL'ler oluşturulur
- ✅ Her commit için build logs görüntülenebilir
- ✅ Rollback yapabilirsiniz (önceki sürüme dönme)

### Yeni Değişiklikler Deploy Etme

```bash
# Değişikliklerinizi yapın
git add .
git commit -m "Update: açıklama"
git push

# Vercel otomatik olarak yeni deploy başlatacak!
```

---

## 6. Environment Variables Yönetimi

### Vercel Dashboard'dan Ekleme

1. Projenizi açın
2. "Settings" → "Environment Variables"
3. Değişkeni ekleyin:
   - **Key**: `NEXT_PUBLIC_AMBIENT_API_KEY`
   - **Value**: API key değeriniz
   - **Environments**: Production, Preview, Development (hepsini seçebilirsiniz)
4. "Save" butonuna tıklayın
5. Redeploy gerekebilir (Vercel sizi uyaracak)

### Local Development için

```bash
# ambient-simulation/.env.local dosyası oluşturun
echo "NEXT_PUBLIC_AMBIENT_API_KEY=your_api_key_here" > ambient-simulation/.env.local
```

**⚠️ ÖNEMLİ**: `.env.local` dosyası `.gitignore` içinde olduğundan GitHub'a yüklenmeyecektir.

---

## 7. Troubleshooting

### Deploy Başarısız Olursa

**Problem**: Build hatası alıyorsunuz

**Çözüm**:
```bash
# Local'de build'i test edin
cd ambient-simulation
npm run build

# Hata varsa düzeltin ve tekrar push edin
```

**Problem**: Environment variable çalışmıyor

**Çözüm**:
- Vercel dashboard'dan environment variable'ı kontrol edin
- `NEXT_PUBLIC_` prefix'i olduğundan emin olun
- Redeploy yapın

**Problem**: 3D visualizations çalışmıyor

**Çözüm**:
- Browser console'u kontrol edin
- WebGL desteklendiğinden emin olun
- `next.config.js` dosyasında `transpilePackages: ['three']` olduğunu doğrulayın

### Log'ları İnceleme

Vercel Dashboard'dan:
1. Projenizi açın
2. "Deployments" sekmesine gidin
3. İlgili deployment'a tıklayın
4. "Build Logs" veya "Function Logs" sekmelerini inceleyin

---

## 8. Performans Optimizasyonu

### Öneriler

1. **Image Optimization**: Vercel otomatik olarak resimleri optimize eder
2. **Caching**: Vercel Edge Network üzerinden global caching sağlar
3. **Analytics**: Vercel Analytics'i etkinleştirin (Settings → Analytics)
4. **Core Web Vitals**: Vercel Dashboard'da performans metrikleri görüntülenebilir

---

## 9. Maliyet

### Vercel Free Plan Limitleri

- ✅ **Bandwidth**: 100 GB/ay
- ✅ **Build Execution**: 100 saat/ay
- ✅ **Serverless Function Execution**: 100 GB-saat/ay
- ✅ **Custom Domains**: Sınırsız
- ✅ **SSL Certificates**: Ücretsiz

Bu proje için **Free Plan yeterlidir**.

### API Maliyeti

Ambient API kullanımı:
- Public endpoints ücretsizdir
- API key opsiyoneldir
- Rate limiting uygulanabilir

---

## 10. Backup ve Güvenlik

### Öneriler

1. **GitHub Repository**: Kodunuz otomatik olarak backup'lanır
2. **Vercel Deployments**: Tüm deployment'lar saklanır ve rollback yapılabilir
3. **Environment Variables**: Hassas bilgileri `.env.local` veya Vercel'de saklayın
4. **.gitignore**: Hassas dosyaların GitHub'a yüklenmediğinden emin olun

---

## Yardım ve Destek

### Kaynaklar

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Ambient Documentation**: [docs.ambient.xyz](https://docs.ambient.xyz)

### İletişim

- GitHub Issues: Repository'nizde issue açabilirsiniz
- Vercel Support: [vercel.com/support](https://vercel.com/support)

---

## Özet: Quick Start Commands

```bash
# 1. GitHub'a push
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/ambient-simulation.git
git push -u origin main

# 2. Vercel'e deploy
npx vercel

# 3. Production deploy
npx vercel --prod
```

**Tebrikler!** 🎉 Ambient Simulation projeniz artık canlı!
