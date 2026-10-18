import type { Playbook } from "./types";

/**
 * Türkçe sürüm. en.ts dosyasının Türkçe konuşan bir yazar tarafından yeniden
 * yazılmış hali, kelime kelime çeviri değil: aynı id'ler, bölüm başına aynı
 * sayıda adım, kontrol maddesi, şablon ve hata (scripts/check-playbook.mjs ile
 * doğrulanır).
 */
export const PLAYBOOK: Playbook = {
  title: "30 Günde Uluslararası Hasta Getiren Web Sitesi Rehberi",
  subtitle: "Kliniğinizin mevcut sitesini, bölüm bölüm ve yapıştırmaya hazır şablonlarla, yurt dışından talep getiren bir siteye dönüştürün.",
  intro:
    "Denetim puanınız sitenin nerede hasta kaybettiğini gösterir. Bu rehber o açıkları kapatır. 10 bölümün her biri bir denetim sorusuna karşılık gelir, tek başına okunur ve bir kontrol listesi, kopyala-yapıştır şablonlar ve net bir sonraki adımla biter. En düşük üç cevabınızla başlayın. Ulaşabileceği bir geliştiricisi olan bir klinik yöneticisi ya da iyi bir freelancer, buradaki her şeyi yeniden tasarım yapmadan uygulayabilir. Hiçbir adım belirli bir platforma bağlı değildir.",
  chapters: [
    {
      id: "languages",
      title: "Hastalarınızın dilinde eksiksiz sayfalar",
      promise: "Bu bölümden sonra hangi sayfaları hangi sırayla çevirteceğinizi ve çevirmene nasıl brief vereceğinizi tam olarak bileceksiniz; sayfalar o pazar için yazılmış gibi okunacak.",
      minutes: 6,
      why: [
        "Riyad'daki, Lyon'daki ya da Manchester'daki bir hasta bir akşamda, telefonundan ve kendi dilinde dört beş kliniği karşılaştırır. Siteniz ona çevrilmiş bir ana sayfa ve İngilizce bir tedavi listesi sunuyorsa uğraşmaz. Onun için yazmış olan kliniğe gider.",
        "Reklam bu açığı pahalı hale getirir. İngilizce bir sayfaya düşen Arapça bir reklam tıklamanın parasını öder ve karşılığında hiçbir şey almaz. Aynı bütçe eksiksiz bir Arapça sayfaya giderse, reklam sonuçlarına yapabileceğiniz en ucuz iyileştirme olur.",
        "İş göründüğünden küçüktür: iki üç pazar, talebe götüren sayfalar, bir kez ana dili o dil olan biri tarafından yazılır, sonra güncel tutulur.",
      ],
      steps: [
        {
          title: "On değil, iki üç pazar seçin",
          body: "Son altı ayın talep listesini açın ve ülkeleri sayın. Çoğunluğu kapsayan iki üç dili seçin. Eklediğiniz her dil, sonsuza kadar güncel tutmanız gereken bir sayfa seti demektir; bu yüzden hastaların zaten olduğu yerden başlayın.",
        },
        {
          title: "Talebe götüren sayfaları listeleyin",
          body: "Her dil için aynı set gerekir: her tedavi sayfası, doktorlar, hasta yolculuğu sayfası, fiyatlar ve SSS, iletişim sayfası ve teşekkür sayfası. Blog bekleyebilir. Tek başına bir ana sayfa dil sürümü değildir; gerisinin eksik olduğunun işaretidir.",
        },
        {
          title: "Sayfaları çevirtmeyin, yazdırın",
          body: "Ana dili o dil olan bir medikal metin yazarına İngilizce sayfayı ve aşağıdaki brief'e verdiğiniz cevapları verin. Yerel gibi okunan bir yeniden yazım isteyin: para birimi alışkanlıkları, hastanın tedaviye verdiği gündelik ad, o pazarın sorduğu sorular. Makine çevirisi taslak çıkarabilir; bitirmesi gereken ana dil konuşanıdır.",
        },
        {
          title: "Düzeni dile uydurun",
          body: "Arapça sayfalar tamamen sağdan sola olmalıdır: metin hizası, menü, ikonlar, formlar ve WhatsApp düğmesi, hepsi aynalanır. Sayıların, tarihlerin ve fiyatların doğru okunduğunu kontrol edin. Fransızca ve Almanca metinler çoğu zaman İngilizceden belirgin şekilde daha uzundur; düğmelere ve başlıklara yer bırakın.",
        },
        {
          title: "Dil seçiciyi başparmağın ulaştığı yere koyun",
          body: "Dilin adını kendi yazısıyla (العربية, Français, Türkçe) üst çubukta, telefonda menü açmadan görünecek şekilde gösterin. Tarayıcı dilini bir kez algılayın ve geçişi önerin; asla zorlamayın.",
        },
        {
          title: "Bütün dilleri eşzamanlı tutun",
          body: "Her dil sürümünün kendi URL'si, kendi başlığı ve meta açıklaması ve diğerlerine işaret eden hreflang etiketleri olmalıdır. Bir dilde bir fiyatı ya da doktoru değiştirdiğinizde aynı gün hepsinde değiştirin. Takvime aylık bir hatırlatma koyun.",
        },
      ],
      checklist: [
        "Gerçek talep ülkelerine göre seçilmiş iki üç hedef dil",
        "Her tedavi sayfası her dilde var, yalnızca ana sayfa değil",
        "Doktorlar, yolculuk, fiyatlar, SSS ve iletişim sayfaları her dilde var",
        "Sayfalar medikal deneyimi olan bir ana dil konuşanı tarafından yazılmış ya da gözden geçirilmiş",
        "Arapça sayfalar formlar ve düğmeler dahil tamamen sağdan sola aynalanmış",
        "Dil seçici telefonda üst çubukta görünür",
        "Her dilin kendi URL'leri, başlıkları, meta açıklamaları ve hreflang etiketleri var",
        "Fiyatları ve doktorları diller arasında eşzamanlı tutmaktan sorumlu bir kişi belirlenmiş",
      ],
      templates: [
        {
          id: "translation-brief",
          title: "Bir pazar için çeviri brief'i",
          kind: "outline",
          note: "Her dil için bir kez doldurun ve İngilizce sayfalarla birlikte gönderin. Çeviriyi yeniden yazıma dönüştürür.",
          body: `Pazar: (ülke ya da bölge, örn. Körfez, Fransa, Birleşik Krallık)
Dil ve çeşit: (örn. Körfez ifadeleriyle Modern Standart Arapça; Fransa Fransızcası)
Kim okuyor: (örn. telefonda 4 kliniği karşılaştıran 35-55 yaş arası bir hasta; çoğu zaman bir aile üyesi rezervasyon yapıyor)
Tedaviye ne diyorlar: (yalnızca klinik adı değil, gündelik adı da yazın)
Ton: sade, sakin, kendinden emin. Ünlem işareti yok. "En iyi klinik" yok.
Para birimi ve fiyatlar: (fiyatları pazarın beklediği gibi EUR / GBP / USD olarak gösterin; başlangıç fiyatını İngilizce sayfayla aynı tutun)
Bu pazarın en çok sorduğu sorular: (WhatsApp geçmişinizden 3 ila 5 soru)
Söylenmeyecekler: (kanıtlayamadığımız iddialar, söz verilen sonuçlar, rakip adları)
Teslim edilecek sayfalar, sırayla: tedavi sayfaları, doktorlar, hasta yolculuğu, fiyatlar, SSS, iletişim, teşekkür
Biçim: sayfa başına bir belge, başlıklar korunur, uzunluk İngilizceden farklı olabilir
Teslim tarihi ve onaylayan: (klinikte kim onaylıyor, ne zamana kadar)`,
        },
      ],
      mistakes: [
        "Yalnızca ana sayfayı çevirip geri kalan her şeyi İngilizceye bağlamak",
        "Soldan sağa düzenle bozuk Arapça üreten bir çeviri eklentisi kullanmak",
        "Dil seçiciyi hamburger menünün içine saklamak",
        "Bir dilde fiyatı değiştirip diğer ikisini aylarca unutmak",
      ],
      done: "Her hedef pazardan bir hasta, tek bir İngilizce sayfa görmeden reklamdan WhatsApp mesajına kadar gidebilir.",
    },
    {
      id: "journey",
      title: "Bütün yolculuğu anlatan tek sayfa",
      promise: "Bu bölümden sonra, koordinatörlerinizin her hafta cevapladığı lojistik sorularını cevaplayan bir hasta yolculuğu sayfanız olacak; hasta WhatsApp'a soru sormaya değil, rezervasyon yapmaya hazır gelecek.",
      minutes: 6,
      why: [
        "Yurt dışındaki hasta tedavide nadiren tereddüt eder. Yolculukta tereddüt eder: beni kim karşılayacak, nerede kalacağım, kaç gün, eşimi getirebilir miyim, eve döndüğümde kimi arayacağım. Site bunları açık bırakırsa hasta karşılaştırmaya devam eder ve her karşılaştırma onu kaybetme ihtimalidir.",
        "Ekibiniz cevapları zaten biliyor. Ayda onlarca kez WhatsApp'ta tekrarlıyor. Her tekrar, rezervasyona hazır bir hastaya gidebilecek dakikalara mal olur; sormayan her hasta ise sessizce gitmiştir.",
        "Hastanın yaşadığı sırayla yazılmış dürüst bir sayfa, bu konuşmaları iki satırlık bir cevaba indirir: 'Evet, tam bu sayfadaki gibi, işte planınız.'",
      ],
      steps: [
        {
          title: "Gerçek soruları toplayın",
          body: "Koordinatörlerden seyahat, konaklama ve sonrası hakkında en sık cevapladıkları on soruyu isteyin. Hastaların kullandığı ifadeyi aynen koruyun. Başlıklarınız bunlar.",
        },
        {
          title: "Hastanın sırasıyla yazın",
          body: "Talep, plan, seyahat, konaklama, tedavi günleri, İstanbul'da takip, evden takip. Yedi kısa bölüm; her birinde ne olduğu, ne kadar sürdüğü, kliniğin ne yaptığı ve hastanın ne yaptığı.",
        },
        {
          title: "Pratik ayrıntıları adlandırın",
          body: "Havalimanı karşılama: hangi havalimanları, kim karşılıyor, hangi dillerde. Otel: hangi sınıf, kliniğe ne kadar uzak, refakatçi ücretsiz kalıyor mu. Günler: her ana tedavi için kaç gün ve ne zaman uçabilecekleri. Ödeme: kabul edilen yöntemler ve her kısmın ne zaman ödendiği.",
        },
        {
          title: "Her aşamada kiminle konuşacaklarını söyleyin",
          body: "Seyahatten önce ve seyahat sırasında fotoğraflı, konuştuğu dilleri belirtilmiş, adı verilmiş bir koordinatör. Eve döndükten sonra takip için adı verilmiş bir kişi ve cevap saatleri. Bu tek ayrıntı, ödemeden sonra unutulma korkusunu ortadan kaldırır.",
        },
        {
          title: "Her tedavi sayfasına kısa bir sürüm ekleyin",
          body: "Üç satır: İstanbul'da kaç gün, ne zaman uçuyorsunuz, neler dahil. Tam yolculuk sayfasına bağlantı. Hasta lojistiği bulmak için tedavi sayfasından asla ayrılmak zorunda kalmamalı.",
        },
        {
          title: "Cevaplarda kullanın",
          body: "Bağlantıyı WhatsApp hızlı cevaplarına kaydedin. Bir hasta karşılamayı ya da oteli sorduğunda ilgili bölümün bağlantısını ve onu ilgilendiren iki satırı gönderin. Sayfa anlatır, koordinatör rezervasyon yapar.",
        },
      ],
      checklist: [
        "Yolculuk sayfası her hedef dilde var",
        "İlk mesajdan evden takibe kadar hastanın sırasıyla yedi aşama",
        "Havalimanları, karşılama, otel sınıfı ve mesafe belirtilmiş",
        "Her ana tedavi için İstanbul'daki gün sayısı ve dönüş günü verilmiş",
        "Refakatçi politikası ve ödeme yöntemleri yazılmış",
        "Adı verilmiş bir koordinatör ve saatleriyle bir takip kişisi",
        "Her tedavi sayfasında bağlantılı üç satırlık özet",
        "Bağlantı ekip için WhatsApp hızlı cevaplarına kaydedilmiş",
      ],
      templates: [
        {
          id: "journey-page",
          title: "Örnek cümlelerle hasta yolculuğu sayfası taslağı",
          kind: "outline",
          note: "Köşeli parantezleri kliniğinizin gerçek bilgileriyle değiştirin. Cümleleri kısa tutun; hasta bunu telefonda okuyor.",
          body: `Başlık: İstanbul'daki tedaviniz, adım adım

1. Talebiniz (0. gün)
"Bize WhatsApp'tan ya da formdan yazın. [Çalışma saatleri içinde 2 saat] içinde [İngilizce, Arapça, Fransızca] konuşan bir koordinatör cevap verir ve fotoğraf ya da röntgen ister."

2. Planınız (1. ila 3. günler)
"Doktorumuz vakanızı inceler ve yazılı bir plan alırsınız: tedaviler, malzemeler, gün sayısı, toplam fiyat ve dahil olanlar. Siz önceden onaylamadıkça varışta hiçbir şey değişmez."

3. Seyahat
"Onayladığınızda tarih öneririz. Uçuşunuzu [İstanbul Havalimanı (IST) ya da Sabiha Gökçen (SAW)] için siz alırsınız; sizi gelişlerde tabelayla karşılar ve otele götürürüz."

4. Konaklamanız
"Kliniğe [10 dakika] mesafede [4 yıldızlı] bir otelde kalırsınız, [kahvaltı dahil, refakatçi ücretsiz]. Otel ile klinik arasındaki bütün transferler dahildir."

5. Tedavi günleri
"[Diş implantı: 3 ila 6 ay arayla 5 ila 7 günlük 2 ziyaret.] Her randevuda bir koordinatör yanınızdadır ve ziyaretler arasında WhatsApp'tan ulaşılabilir."

6. İstanbul'da takip
"Dönmeden önce doktoru görürsünüz. Kendi dilinizde yazılı talimatlar, gerekiyorsa ilaçlar ve koordinatörünüzün numarasıyla ayrılırsınız."

7. Evden takip
"[1 hafta, 1 ay ve 6 ay] sonra sizi ararız. Her soru için [ad]'a WhatsApp'tan yazın; [bir iş günü] içinde cevap alırsınız. Ülkenizdeki diş hekiminiz dosyanız hakkında bizimle doğrudan görüşebilir."

Kapanış cümlesi
"Cevaplamadığımız bir sorunuz mu var? Bize yazın, kendi dilinizde cevap veriyoruz." [WhatsApp düğmesi]`,
        },
      ],
      mistakes: [
        "Sayfayı bir program yerine satış metni gibi yazmak",
        "'Duruma göre değişir' diyerek gün sayısını belirsiz bırakmak; tedavi başına bir aralık vermek yerine",
        "Adı verilmiş bir takip kişisi olmaması; hasta ödemeden sonra unutulmaktan korkar",
        "Sayfayı hiçbir tedavi sayfasının bağlanmadığı alt bilgiye gömmek",
      ],
      done: "Bir koordinatör her lojistik soruyu, sayfanın bir bölümünün bağlantısı ve iki cümleyle cevaplayabilir.",
    },
    {
      id: "whatsapp",
      title: "Her tedavi sayfasında bir WhatsApp düğmesi",
      promise: "Bu bölümden sonra her tedavi sayfası, ekibinize tedaviyi ve dili söyleyen önceden doldurulmuş bir mesajla WhatsApp sohbeti açacak; ekibinizin elinde bir hastayı üç soruda eleyen hazır cevaplar olacak.",
      minutes: 7,
      why: [
        "Uluslararası hastaların çoğu formdan değil, WhatsApp'tan yazar. Bir tedavi sayfasını okuyup sormaya karar veren hastanın o anda tek bir sorusu vardır. Düğme iletişim sayfasındaysa aramak zorunda kalır. Çoğu aramaz; bir sonraki kliniğin sekmesini açar.",
        "Düğme işin yarısıdır. Diğer yarısı ilk cevaptır. Dört kliniğe yazan bir hasta çoğu zaman ilk cevaplayan ve mantıklı sorular soranla devam eder. Ertesi sabah 'Nasıl yardımcı olabiliriz?' diye cevaplayan klinik o akşamı çoktan kaybetmiştir.",
        "Bu genellikle talepler için tek başına en büyük kaldıraçtır ve bir öğleden sonraya mal olur.",
      ],
      steps: [
        {
          title: "Kliniğe ait bir WhatsApp Business numarası kullanın",
          body: "Bir koordinatörün kişisel telefonu değil. İşletme profilini klinik adı, adres, web sitesi ve konuşulan dillerle doldurun. Çalışma saatlerini ve bir uzaktayım mesajını ayarlayın ki kimse bütün gece cevapsız beklemesin.",
        },
        {
          title: "Her tedavi ve dil için ayrı bir bağlantı oluşturun",
          body: "Bağlantı biçimi https://wa.me/<numara>?text=<mesaj> şeklindedir; numara artı ve boşluk olmadan uluslararası biçimde, mesaj URL kodlanmış olarak (boşluk %20, satır sonu %0A). Her tedavi sayfasına tedavinin adını geçen kendi hazır mesajını verin ki ekip ilk kelimeyi okumadan bağlamı bilsin.",
        },
        {
          title: "Düğmeyi başparmağın düştüğü yere koyun",
          body: "Telefonda: ekranın altında sabit, kaydırmadan görünen bir düğme, her tedavi sayfasında. Masaüstünde: üst çubukta ve fiyat bölümünün hemen altında. Yalnızca ikonla değil, eylemle etiketleyin: 'WhatsApp'tan yazın'.",
        },
        {
          title: "İlk cevabı ilk mesaj gelmeden yazın",
          body: "Hastanın dilinde selamlama, bir cümle güven verme, sonra üç eleme sorusu: hangi tedavi, ne zaman seyahat edebilir, bir fotoğraf ya da tarama. Hızlı cevap olarak kaydedin. Aşağıdaki şablonda metin var.",
        },
        {
          title: "Ekibin tutabileceği bir cevap standardı belirleyin",
          body: "Gerçekten tutabileceğiniz bir hedef seçin; örneğin çalışma saatlerinde 15 dakika içinde ve gece gelen mesajlara 09:00'a kadar ilk cevap. Sayfaya yazın: 'İstanbul saatiyle 09:00 ile 20:00 arasında 15 dakika içinde cevap veriyoruz.' Tutulan bir söz, dönüşüm aracıdır.",
        },
        {
          title: "Tıklamaları izleyin",
          body: "Her WhatsApp düğmesi, sayfayı ve tedaviyi parametre olarak taşıyan bir tıklama olayı tetiklemelidir (9. bölüm nasıl yapılacağını gösterir). Bu olmadan hangi sayfanın ya da reklamın sohbeti getirdiğini bilemezsiniz.",
        },
      ],
      checklist: [
        "Kliniğe ait bir numarada, profil ve saatleri ayarlanmış WhatsApp Business hesabı",
        "Her tedavi sayfasında, telefonda altta sabit bir düğme",
        "Hazır mesaj tedaviyi ve sayfanın dilini belirtiyor",
        "Çalışma saatleri dışında her hedef dilde uzaktayım mesajı",
        "Her dil için üç eleme sorulu ilk cevap hızlı cevap olarak kaydedilmiş",
        "Cevap standardı sayfaya yazılmış ve haftalık ölçülüyor",
        "Düğme yalnızca ikonla değil, kelimelerle etiketlenmiş",
        "Tıklama olayı sayfa ve tedavi parametreleriyle tetikleniyor",
      ],
      templates: [
        {
          id: "wa-prefilled",
          title: "Tedavi başına hazır WhatsApp mesajları",
          kind: "message",
          note: "Her tedavi sayfası için bir tane; Türkçe sayfalarda Türkçe, İngilizce sayfalarda İngilizce. Bağlantıyı oluştururken boşlukları %20 olarak kodlayın. Hasta göndermeden önce düzenleyebilir.",
          body: `Diş implantı (TR):
Merhaba, diş implantı sayfanızı okuyorum ve fiyat teklifi almak istiyorum. Ülkem: ___

Lamine / gülüş tasarımı (TR):
Merhaba, lamine ile ilgileniyorum. Plan için dişlerimin fotoğraflarını gönderebilir miyim? Ülkem: ___

Saç ekimi (TR):
Merhaba, saç ekimi için değerlendirme istiyorum. Saçımın fotoğraflarını gönderebilirim. Ülkem: ___

Rinoplasti (TR):
Merhaba, rinoplasti düşünüyorum ve konsültasyon istiyorum. Ülkem: ___

Genel mesaj (TR):
Merhaba, [tedavi] hakkında bir sorum var ve bir koordinatörle görüşmek istiyorum. Ülkem: ___

Diş implantı (EN):
Hello, I am reading your dental implants page and would like a quote. My country: ___

Genel mesaj (EN):
Hello, I have a question about [treatment] and would like to speak to a coordinator. My country: ___

Örnek bağlantı:
https://wa.me/90XXXXXXXXXX?text=Hello%2C%20I%20am%20reading%20your%20dental%20implants%20page%20and%20would%20like%20a%20quote.%20My%20country%3A%20`,
        },
        {
          id: "wa-first-reply",
          title: "Klinik ekibi için ilk cevap metinleri",
          kind: "message",
          note: "Hızlı cevap olarak kaydedin. Dakikalar içinde gönderin. Üç soruyu tek mesajda sorun ki hasta bir kez cevaplasın.",
          body: `İlk cevap (TR):
Merhaba [ad], [Klinik]'e yazdığınız için teşekkürler. Ben [koordinatör], vakanızla ben ilgileneceğim. Doktorumuzla bir plan hazırlayabilmem için şunları söyler misiniz:
1. Hangi tedaviyi düşünüyorsunuz ve bugün sizi en çok rahatsız eden ne
2. İstanbul'a yaklaşık ne zaman gelebilirsiniz
3. Doktorun değerlendirebilmesi için bir fotoğraf (varsa röntgen)
Bunlar elime geçer geçmez fiyatı ve gün sayısını içeren yazılı bir plan alacaksınız.

Hasta yalnızca "fiyat?" yazarsa (TR):
Tabii. [Tedavi] fiyatları [tutar]'dan başlıyor ve [otel, transferler, malzemeler] dahil. Kesin fiyat vakanıza bağlı; bir fotoğraf gönderin, doktorumuza [24 saat] içinde onaylatayım.

Gece uzaktayım mesajı (TR):
Mesajınız için teşekkürler. Ekibimiz İstanbul saatiyle 09:00 ile 20:00 arasında cevap veriyor. [Koordinatör] sabah ilk iş size yazacak. Mümkünse planınızı hazırlayabilmemiz için bir fotoğraf ve ülkenizi gönderin.

2 gün cevap gelmezse takip (TR):
Merhaba [ad], planı alıp almadığınızı kontrol etmek istedim. Fiyat, İstanbul'daki günler ya da otel hakkında sorularınız varsa burada memnuniyetle cevaplarım.

İlk cevap (EN):
Hello [name], thank you for writing to [Clinic]. I am [coordinator], I will look after your case. So I can prepare a plan with our doctor, could you tell me:
1. Which treatment you are considering, and what bothers you most today
2. When you could travel to Istanbul, roughly
3. A photo (or an X-ray if you have one), so the doctor can assess
As soon as I have these, you will receive a written plan with the price and the number of days.`,
        },
      ],
      mistakes: [
        "Düğmenin yalnızca iletişim sayfasında olması ya da geç yüklenen bir sohbet aracının içine saklanması",
        "Koordinatörle birlikte giden kişisel bir koordinatör numarası",
        "Sorusuz bir 'Nasıl yardımcı olabiliriz?' ilk cevabı; konuşma orada durur",
        "Uzaktayım mesajı olmaması; 23:00'te yazan hasta öğlene kadar sessizlik okur",
      ],
      done: "Telefonda herhangi bir tedavi sayfasını açın, bir kez dokunun; tedavinin adı geçen bir sohbet açılır ve bir test mesajı, belirttiğiniz süre içinde üç soru içeren hazır cevabı alır.",
    },
    {
      id: "speed",
      title: "Telefonda 3 saniyenin altında açılan sayfalar",
      promise: "Bu bölümden sonra tedavi sayfalarınız mobil hız testini geçecek ve her içerik değişikliğinden sonra hızlı kalmaları için basit bir aylık rutininiz olacak.",
      minutes: 5,
      why: [
        "Hastalar telefonda gezer; çoğu zaman mobil veriyle, çoğu zaman doğrudan bir reklamdan. Hâlâ yüklenen bir sayfa kapatılır. Tıklamanın parasını siz ödediniz; hastayı bir sonraki klinik alır.",
        "Hız ne kadar ödediğinizi de belirler. Google yavaş sayfaları daha aşağıda sıralar ve Ads'de yavaş açılış sayfalarına daha düşük puan verir; aynı bütçe daha az ziyaret alır.",
        "Yavaş klinik sitelerinin çoğunda dört ortak neden vardır: devasa görseller, giriş videosu, slider'lar ve yığınla script. Dördü de yeniden tasarım olmadan düzeltilebilir.",
      ],
      steps: [
        {
          title: "Ana sayfayı değil, tedavi sayfalarını ölçün",
          body: "Her dilde üç tedavi sayfası için Google PageSpeed Insights'ı mobil sekmesinde çalıştırın. Largest Contentful Paint (iyi: 2,5 saniye ya da altı), Interaction to Next Paint (200 milisaniye ya da altı) ve Cumulative Layout Shift (0,1 ya da altı) değerlerini not edin. Sayıları aşağıdaki günlüğe yazın.",
        },
        {
          title: "Her görseli küçültün",
          body: "Fotoğrafları gösterildikleri genişlikte WebP olarak dışa aktarın ve her birini yaklaşık 200 KB'ın altında tutun. Telefondaki giriş görselinin 2.000 piksel genişliğinde olmasına gerek yok. Her görsele genişlik ve yükseklik verin ki sayfa yüklenirken zıplamasın.",
        },
        {
          title: "Giriş videosunu ve slider'ları kaldırın",
          body: "Arka plan videosu megabaytlara mal olur ve hastanın ihtiyaç duyduğu hiçbir şeyi göstermez. Yerine tek bir güçlü fotoğraf koyun. Slider'ların yerine en iyi tek görseli koyun: kimse üçüncü slaytı beklemez.",
        },
        {
          title: "Kullanmadığınız script'leri atın",
          body: "Her üçüncü taraf script'i listeleyin: sohbet araçları, ısı haritaları, eski pikseller, üç sağlayıcıdan yazı tipleri. Okuduğunuz analitiği, çalıştırdığınız reklam pikselini ve tek bir sohbet aracını tutun. Gerisini sayfa göründükten sonra yükleyin ya da kaldırın.",
        },
        {
          title: "Önbellek ve CDN kullanın",
          body: "Geliştiricinizden tarayıcı önbelleğini, sıkıştırmayı ve bir içerik dağıtım ağını açmasını isteyin ki Cidde'deki ya da Paris'teki hastaya yakın bir noktadan hizmet verilsin. Çoğu barındırma hizmetinde bu bir proje değil, bir ayardır.",
        },
        {
          title: "Gerçek bir telefonda test edin",
          body: "Sayfaları ofis Wi-Fi'ında değil, 4G üzerinden orta sınıf bir Android'de açın. WhatsApp düğmesi üç saniye içinde görünüyor ve dokunulabiliyorsa iş tamamdır. Her içerik değişikliğinden sonra yeniden test edin; yeni görseller en sık görülen gerilemedir.",
        },
      ],
      checklist: [
        "Her dilde üç tedavi sayfasında mobil test yapılmış, sayılar kaydedilmiş",
        "Bu sayfalarda LCP 2,5 s ya da altı, INP 200 ms ya da altı, CLS 0,1 ya da altı",
        "Bütün görseller WebP, gösterim genişliğinde, yaklaşık 200 KB altında",
        "Tedavi sayfalarında arka plan videosu ve slider yok",
        "Üçüncü taraf script'ler listelenmiş; kullanılmayanlar kaldırılmış",
        "Önbellek, sıkıştırma ve CDN açık",
        "Sayfalar mobil veriyle gerçek bir telefonda kontrol edilmiş",
        "Takvimde sorumlusu belirlenmiş aylık yeniden test",
      ],
      templates: [
        {
          id: "speed-log",
          title: "Aylık hız günlüğü",
          kind: "table",
          note: "Her sayfa için ayda bir satır. Bir sayı kötüleşirse neden genellikle son içerik değişikliğidir.",
          body: `| Tarih | Sayfa (URL) | Dil | LCP (s) | INP (ms) | CLS | Sayfa ağırlığı (MB) | Geçen aydan beri ne değişti | Sorumlu |
|---|---|---|---|---|---|---|---|---|
| 2026-01-05 | /tr/dis-implanti | TR | 2,1 | 140 | 0,03 | 1,2 | Giriş videosu kaldırıldı | Geliştirici |
| 2026-01-05 | /ar/dental-implants | AR | 2,4 | 150 | 0,05 | 1,3 | Görseller WebP'ye çevrildi | Geliştirici |`,
        },
      ],
      mistakes: [
        "Ana sayfayı ofis Wi-Fi'ında test edip siteye hızlı demek",
        "Telefon fotoğraflarını doğrudan kameradan tam boyutta yüklemek",
        "'Premium duruyor' diye giriş videosunu tutmak",
        "İlkini kaldırmadan ikinci bir sohbet aracı eklemek",
      ],
      done: "Her dilde üç tedavi sayfası mobil testte yeşil alıyor ve WhatsApp düğmesine gerçek bir telefonda üç saniye içinde dokunulabiliyor.",
    },
    {
      id: "treatments",
      title: "Fiyatı ve iyileşme süresini söyleyen tedavi sayfaları",
      promise: "Bu bölümden sonra her tedavinin başlangıç fiyatı, dahil olanlar, İstanbul'daki gün sayısı ve dönüş günüyle kendi sayfası olacak; hastanın ilk mesajı fiyat sorusu değil, rezervasyon sorusu olacak şekilde yazılmış.",
      minutes: 8,
      why: [
        "Fiyat ve iyileşme süresi, her hastanın yazmadan önce sorduğu iki sorudur. Gizlemek fiyat konuşmasını önlemez; açıkça cevap veren bir rakibe taşır ve WhatsApp'ınızı hiç seyahat etmeyecek kişilerin 'ne kadar?' mesajlarıyla doldurur.",
        "İkisine de cevap veren bir sayfa, fiyat avcılarından daha az, aralığı zaten kabul etmiş hastalardan daha çok talep alır. Bu, günü fiyat vererek geçiren koordinatörle rezervasyon yaparak geçiren koordinatör arasındaki farktır.",
        "Hastalar fiyatı bir sinyal olarak da okur. Dahil olanlarıyla birlikte verilen bir başlangıç fiyatı profesyonel okunur. Piyasanın çok altındaki bir fiyat risk gibi okunur.",
      ],
      steps: [
        {
          title: "Her tedavi için, her dilde bir sayfa",
          body: "On iki paragraflık bir 'Hizmetler' sayfası değil. Diş implantı, All-on-4, lamine, saç ekimi, rinoplasti: her birinin kendi URL'si, başlığı ve bir reklamın açılış sayfası olarak tek başına durabilecek bir sayfası olmalı.",
        },
        {
          title: "Her sayfada aynı yapıyı izleyin",
          body: "Nedir ve kimin için, burada nasıl yapılıyor, İstanbul'da gün ve ziyaret sayısı, ne zaman dönüyorsunuz, başlangıç fiyatı ve dahil olanlar, kullanılan malzemeler ve markalar, uygulayan doktorlar, öncesi-sonrası vakalar, SSS, WhatsApp düğmesi. Aşağıdaki taslakta örnek metin var.",
        },
        {
          title: "Başlangıç fiyatı verin ve neleri kapsadığını söyleyin",
          body: "Tipik basit bir vaka için dürüst en düşük fiyatı seçin ve neleri kapsadığını listeleyin: konsültasyon, malzemeler, otel geceleri, transferler, ilaçlar, takip. Dahil olmayanları da söyleyin. Gerçekten kullandığınız implant ya da malzeme markalarını adlandırın; hastalar sorar ve yazılı bir cevap güven kurar.",
        },
        {
          title: "Günleri ve iyileşmeyi açıkça yazın",
          body: "İstanbul'da gün sayısı, ziyaret sayısı, hastanın ne zaman uçabileceği, ne zaman işe dönebileceği ve evdeki ilk haftanın nasıl geçeceği. Aralık vermek sorun değil; belirsizlik sorundur.",
        },
        {
          title: "Beş gerçek soruyu ekleyin",
          body: "Koordinatörlerin bu tedavi için en çok cevapladığı beş soruyu alın ve dürüst cevaplar yazın; rahatsız edici olanlar dahil: ağrı, sade kelimelerle başarısızlık oranları, evde bir şey ters giderse ne olacağı.",
        },
        {
          title: "Tek bir eylemle bitirin",
          body: "Sayfa, bu tedavi için önceden doldurulmuş WhatsApp düğmesi ve formu tercih eden hastalar için bir formla biter. Sayfanın altında dikkat için yarışan başka hiçbir şey olmamalı.",
        },
      ],
      checklist: [
        "Sattığınız her tedavinin her dilde kendi sayfası ve URL'si var",
        "Başlangıç fiyatı, dahil olan ve olmayanların net listesiyle gösteriliyor",
        "Malzemeler ve markalar adlandırılmış",
        "İstanbul'da gün sayısı, ziyaret sayısı ve dönüş günü verilmiş",
        "Evdeki ilk hafta için iyileşme takvimi",
        "Dürüst cevaplarla beş gerçek SSS",
        "Uygulayan doktorlar adıyla bağlanmış",
        "Sayfanın sonunda hazır WhatsApp düğmesi ve kısa form",
      ],
      templates: [
        {
          id: "treatment-page",
          title: "Örnek metinle tedavi sayfası taslağı (diş implantı)",
          kind: "outline",
          note: "Rakamları kendi rakamlarınızla değiştirin. Yapı her tedavi için çalışır; bölüm sırasını koruyun.",
          body: `H1: İstanbul'da diş implantı

Giriş (2 satır)
"Tek bir dişi ya da tam bir çeneyi, [yıl] yılda [sayı] implant yerleştirmiş [Dr. Ad] tarafından uygulanan titanyum implantlarla değiştirin. İstanbul'a iki ziyaret, seyahatten önce yazılı plan."

Nedir ve kimin için
"İmplant, çene kemiğine yerleştirilen ve bir kron, köprü ya da tam çeneyi taşıyan titanyum bir vidadır. Bir ya da daha fazla dişi eksik olan ve yeterli kemiği bulunan ya da önce kemik grefti kabul eden hastalara uygundur. Tedavi edilmemiş diş eti hastalığı ya da kontrolsüz diyabette uygun değildir; bunu konsültasyonda kontrol ederiz."

Burada nasıl yapılıyor
"1. ziyaret (5 ila 7 gün): muayene, 3D tarama, implant yerleştirme, geçici dişler. 2. ziyaret (3 ila 6 ay sonra, 5 ila 7 gün): kalıcı kronların ya da köprünün takılması ve ayarlanması."

İstanbul'da gün sayısı ve dönüş
"5 ila 7 günlük iki ziyaret. İmplant yerleştirmeden 48 saat sonra uçabilirsiniz. Çoğu hasta eve döndükten bir gün sonra masa başı işine döner."

Başlangıç fiyatı
"İmplant başına [tutar]'dan, tam çene (All-on-4) için [tutar]'dan başlar."
Dahil: konsültasyon ve 3D tarama, implant ve abutment ([marka]), geçici dişler, kalıcı kronlar ([malzeme]), ziyaret başına [n] otel gecesi, havalimanı ve klinik transferleri, ilaçlar, evden takip.
Dahil değil: uçuşlar, gerekirse kemik grefti ([tutar]), ek geceler.

Malzemeler
"[İmplant markası, üretim ülkesi], [kron malzemesi]. İmplantta ömür boyu, kronda [yıl] garanti; koşullar planınızda açıklanır."

Doktorunuz
"[Dr. Ad], [unvan], [yıl] yıl implant cerrahisi, [dernek] üyesi." [profile bağlantı]

Sonuçlar
[3 ila 6 öncesi-sonrası vaka, aynı açı, yaş aralığı, ne yapıldığı ve gün sayısıyla]

SSS
- Acır mı? "Yerleştirme lokal anestezi altında yapılır; çoğu hasta, verdiğimiz ilaçlarla kontrol edilen 2 ila 3 günlük bir rahatsızlık tarif eder."
- İmplant tutmazsa ne olur? "[Gerçek politikanız: değiştirme koşulları, neyin karşılandığı, hastanın ne ödediği.]"
- Takibi kendi diş hekimim yapabilir mi? "Evet. Tam dosyanızı ve taramalarınızı alırsınız; gerekirse diş hekiminizle doğrudan görüşürüz."
- Tek ziyarette olur mu? "Bazı vakalarda anında yükleme mümkündür; taramadan sonra doktor karar verir."
- Nasıl ödeme yapılır? "[Yöntemler], onayda [kapora], kalan ilk ziyarette."

Kapanış
"WhatsApp'tan bir fotoğraf ya da röntgen gönderin, yazılı planınızı [24 saat] içinde alın." [hazır WhatsApp düğmesi] [kısa form]`,
        },
        {
          id: "price-table",
          title: "Fiyat aralığı tablosu",
          kind: "table",
          note: "Tedavi sayfası başına bir tablo ya da tek bir fiyat sayfası. Yalnızca başlangıç fiyatları; kesin rakamı plan verir.",
          body: `| Tedavi | Başlangıç fiyatı | Tipik aralık | İstanbul'da gün | Ziyaret | Dahil | Dahil değil |
|---|---|---|---|---|---|---|
| Tek diş implantı | [tutar] | [aralık] | ziyaret başına 5 ila 7 | 2 | Tarama, implant, kron, [n] otel gecesi, transferler | Uçuşlar, kemik grefti |
| All-on-4 (çene başına) | [tutar] | [aralık] | ziyaret başına 5 ila 7 | 2 | Tarama, 4 implant, geçici ve kalıcı köprü, otel, transferler | Uçuşlar, [n] üzeri çekimler |
| Lamine (diş başına) | [tutar] | [aralık] | 5 ila 7 | 1 | Gülüş tasarımı, lamineler ([malzeme]), otel, transferler | Uçuşlar, beyazlatma |
| Saç ekimi (FUE) | [tutar] | [aralık] | 3 | 1 | [n] grefte kadar, ilaçlar, otel, transferler | Uçuşlar, PRP seansları |
| Rinoplasti | [tutar] | [aralık] | 7 | 1 | Ameliyat, hastanede 1 gece, otel, transferler | Uçuşlar, revizyon ameliyatı |`,
        },
      ],
      mistakes: [
        "Fiyatsız, günsüz ve doktorsuz tek bir 'Hizmetlerimiz' sayfası",
        "Her sayfada 'Fiyat için bize ulaşın'; fiyata duyarlı hastaları başka yere yollar, fiyat avcılarını WhatsApp'ınızda tutar",
        "Kimsede olmayan bir vakaya uyacak kadar düşük bir başlangıç fiyatı",
        "Marka adı vermeden malzemeleri 'premium' diye tanımlamak",
      ],
      done: "Bir hasta tek bir sayfayı okuyup tedaviyi, dahil olanlarıyla başlangıç fiyatını, günleri, dönüş gününü ve kimin uyguladığını öğrenir; sonra 'ne kadar' yerine bir tarihle yazar.",
    },
    {
      id: "credentials",
      title: "Hastanın doğrulayabileceği yeterlilikler",
      promise: "Bu bölümden sonra her doktorun hastanın doğrulayabileceği bir profil sayfası olacak ve kliniğin akreditasyonları alt bilgiyi süslemek yerine şüpheyi kaldırdıkları yerde gösterilecek.",
      minutes: 5,
      why: [
        "Başka bir ülkeye uçan hastanın yazmadan önce size güvenmek için bir nedene ihtiyacı vardır. Adlar, diplomalar, üyelikler, yıllar, işlem sayıları: bunlar o nedeni verir. Stok fotoğraflar ve 'uzman ekip' vermez; şüphe, bir rakip kaldırana kadar kalır.",
        "Hastalar yurt dışındaki klinikler hakkındaki uyarıları okudu. Doktorun adını arar ve Google'a yazar. Arama bir şey bulmazsa ya da başka bir klinik bulursa, hazır olan bir hastayı kaybedersiniz.",
        "Bu bölüm bir sabah için bir fotoğrafçıya ve doktor başına bir saate mal olur. Her sayfada geri döner.",
      ],
      steps: [
        {
          title: "Her doktor için bir profil sayfası",
          body: "Kayıtlı gerçek ad, klinikte çekilmiş profesyonel fotoğraf, unvan, uzmanlık, meslekte geçen yıllar ve uyguladığı tedaviler. Profili göründüğü her tedavi sayfasından bağlayın ve geri bağlayın.",
        },
        {
          title: "Doğrulanabilecekleri listeleyin",
          body: "Üniversite ve yıl, uzmanlık eğitimi, varsa meslek kayıt numarası, adı verilmiş derneklere üyelikler ve yaklaşık işlem sayıları. Her madde bir hasta ya da ülkesindeki doktoru tarafından kontrol edilebilir olmalı.",
        },
        {
          title: "Akreditasyonları önem taşıdıkları yerde gösterin",
          body: "Kliniğin ruhsatlarını ve akreditasyonlarını hakkımızda sayfasına ve her tedavi sayfasının güven satırına, veren kurumun adı ve bağlantısıyla koyun. Uluslararası sağlık turizmi yetki belgesi sizi kapsıyorsa gösterin; düzenlenmiş pazarlardan gelen hastalar bunu arar.",
        },
        {
          title: "Kanıtlanamayanı kaldırın",
          body: "'Türkiye'nin en iyi kliniği', 'dünya standartlarında', 'bir numara'. Her birini bir olguyla değiştirin: yıllar, sayılar, adlar. Olgu kontrol etmeye davet eder; slogan şüpheye.",
        },
        {
          title: "Hastaların gerçekten tanışacağı kişileri ekleyin",
          body: "Fotoğraf, ad ve dilleriyle koordinatörler. Hastanın ilk teması cerrah değil, koordinatördür; adı olan bir yüz ilk mesajı göndermeyi kolaylaştırır.",
        },
        {
          title: "Güncel tutun",
          body: "Bir doktor geldiğinde ya da ayrıldığında profilleri ve tedavi sayfalarını aynı hafta her dilde güncelleyin. Ayrılmış bir doktorun profili bekleyen bir şikayettir.",
        },
      ],
      checklist: [
        "Her doktor için klinikte çekilmiş gerçek fotoğraflı profil sayfası",
        "Diplomalar, kayıt, üyelikler ve yıllar listelenmiş ve kontrol edilebilir",
        "Ana tedavi başına yaklaşık işlem sayısı",
        "Profiller tedavi sayfalarından ve tedavi sayfalarına bağlanmış",
        "Akreditasyonlar veren kurumun adı ve bağlantısıyla gösterilmiş",
        "Kanıtlanamayan üstünlük ifadeleri her sayfadan kaldırılmış",
        "Koordinatörler ad, fotoğraf ve dilleriyle gösterilmiş",
        "Ekip değiştiğinde profiller bütün dillerde güncellenmiş",
      ],
      templates: [
        {
          id: "doctor-profile",
          title: "Doktor profili şablonu",
          kind: "text",
          note: "Her doktor için bir tane. Olguları doğrulanabilir tutun; bir hastanın aramasını istemeyeceğiniz hiçbir şeyi yazmayın.",
          body: `Ad: Dr. [Ad Soyad], [Diş Hekimi / Tıp Doktoru / uzmanlık unvanı]
Klinikteki rolü: [örn. İmplant ve ağız cerrahı, implant ekibi sorumlusu]
Diller: [Türkçe, İngilizce; Arapça konsültasyonlar bir koordinatörle]
Meslekte yıl: [n]
İşlemler: [örn. yılda yaklaşık n implant; yıl'dan beri n tam çene vakası]

Eğitim
- [Üniversite], [derece], [yıl]
- [Uzmanlık eğitimi ya da ihtisas], [kurum], [yıl]
- [Fellowship ya da ileri eğitim], [kurum], [yıl]

Kayıt ve üyelikler
- [Meslek odası ya da kayıt], no. [numara]
- [Dernek adı], [yıl]'dan beri üye

Burada uyguladığı tedaviler
- [Tedavi 1] [bağlantı]
- [Tedavi 2] [bağlantı]

Kendi sözleriyle (2 ila 3 sade cümle)
"[Bir vakayı nasıl planladığı, seyahatten önce hastalara ne söylediği, neyi yapmayı reddettiği.]"

Hasta geri bildirimi
[Bağlantı verebileceğiniz yorumlardan ad, ülke ve tedaviyle 2 kısa alıntı]

[WhatsApp düğmesi: Dr. [Soyad]'a soru sorun]`,
        },
      ],
      mistakes: [
        "Beyaz önlüklü mankenlerin stok fotoğrafları",
        "Adı olmayan 'uzman ekibimiz'; hiçbir şey aranamaz",
        "Alt bilgide veren kuruma bağlantısız akreditasyon logoları",
        "Geçen yıl ayrılmış bir doktoru hâlâ listeleyen profiller",
      ],
      done: "Bir hasta her doktorun adını aratıp profil sayfanızdaki olguların aynısını bulabilir ve her akreditasyon kurumuna tıklayıp gidebilir.",
    },
    {
      id: "gallery",
      title: "Onaylı öncesi-sonrası sonuçlar",
      promise: "Bu bölümden sonra tedaviye göre gruplanmış, her seferinde aynı şekilde çekilmiş ve her vaka için yazılı onayı dosyada olan bir galeriniz olacak; hastalar sizi fiyat yerine sonuçlarla karşılaştıracak.",
      minutes: 5,
      why: [
        "Sonuçlar elinizdeki en güçlü kanıttır. Onlar olmadan hasta sizi fiyatla karşılaştırır ve fiyatta her zaman daha ucuzu vardır. Tedavi başına altı iyi vaka, herhangi bir metin paragrafından fazlasını yapar.",
        "Onay olmadan, bütün galeriyi indirmenize bir şikayet kalmıştır; yüzünü sitenizde onay vermeden bulan bir hasta, toparlanamayacağınız bir yorumdur.",
        "Kurallar basit: aynı açı, aynı ışık, kısa bir açıklama, yazılı onay. Zor olan alışkanlığı oturtmaktır.",
      ],
      steps: [
        {
          title: "Tedavi başına standart çekimi belirleyin",
          body: "Dişler için: ekartörlü ön gülüş ve doğal gülüş, aynı mesafe, aynı ışık. Saç için: ön, üst ve iki yan, kuru saç, aynı arka plan. Yüz için: ön ve profil, makyajsız, nötr ifade. Tedavi odasında bir karta yazın.",
        },
        {
          title: "Öncesi fotoğrafını her seferinde çekin",
          body: "İlk ziyarette, hiçbir şey yapılmadan önce, karta göre. Sonrası fotoğrafı son kontrolde ve sonucun oturduğu takip ziyaretinde bir daha. Alışkanlık, yöntemin tamamıdır.",
        },
        {
          title: "Onayı yazılı ve hastanın dilinde alın",
          body: "Neyin, nerede, ne kadar süre gösterileceğini, yüzün gizlenip gizlenmeyeceğini ve hastanın onayı geri çekebileceğini söyleyen tek sayfalık bir form. Hasta dosyasıyla saklayın. Bu hukuki tavsiye değildir; formu size uygulanan yasaya göre avukatınıza kontrol ettirin.",
        },
        {
          title: "Her vakayı üç olguyla açıklayın",
          body: "Yaş aralığı, ne yapıldığı, İstanbul'daki gün sayısı. Ad yok. Örneğin: '40'lı yaşlar, üst ve alt All-on-4, 6 günlük 2 ziyaret.' Karşılaştıran hastanın istediği budur.",
        },
        {
          title: "Tedaviye göre gruplayın ve vakaları tedavi sayfasına koyun",
          body: "Bir galeri sayfası iyidir; tedavi sayfasının kendisinde üç ila altı vaka daha iyidir, çünkü hasta kararı orada verir. Öncesi ve sonrasını yan yana, aynı boyutta gösterin.",
        },
        {
          title: "Göstermediklerinizi söyleyin",
          body: "Bir sonuç değişkenlik gösteriyorsa galerinin altında tek cümleyle söyleyin. Yüzleri gizli gösteriyorsanız bunun hastanın isteğiyle olduğunu belirtin. Sınırlar hakkında dürüstlük, gösterilen sonuçları inandırıcı kılar.",
        },
      ],
      checklist: [
        "Tedavi başına yazılı bir standart çekim, tedavi odasında görünür",
        "Her hastada ilk ziyarette öncesi fotoğrafı çekilmiş",
        "Son kontrolde ve takipte sonrası fotoğrafı",
        "Hastanın dilinde imzalı onay formu, dosyayla saklanmış",
        "Her vakada yaş aralığı, tedavi ve gün sayısıyla açıklama",
        "Her tedavi sayfasında yan yana aynı boyutta üç ila altı vaka",
        "İstendiğinde yüzler gizlenmiş ve bu belirtilmiş",
        "Galerinin altında sonuçların değişkenliği hakkında bir cümle",
      ],
      templates: [
        {
          id: "consent-checklist",
          title: "Öncesi-sonrası onay kontrol listesi (hukuki tavsiye değildir)",
          kind: "text",
          note: "Avukatınız için bir başlangıç noktası, onun yerine geçmez. Yasalar ülkeye göre değişir; AB, Birleşik Krallık ve Körfez hastalarının beklentileri farklıdır.",
          body: `Fotoğraftan önce
- Hastaya fotoğrafların öncelikle tıbbi dosyası için olduğu söylenmiş; yayın ayrı ve isteğe bağlı bir karar
- Standart açılar ve ışık kullanılmış, hasta kabul etmedikçe tanımlayıcı öğe yok (takı, dövme)

Onay formunda yazması gerekenler
- Klinik adı ve hastanın tam adı
- Tam olarak ne yayınlanacağı: [bölge] öncesi ve sonrası fotoğrafları, yüz görünür / gözler kapalı / yüz kırpılmış
- Nerede: klinik web sitesi, sosyal medya hesapları (adlarını yazın), basılı malzeme
- Ne kadar süreyle, ve hastanın onayı istediği zaman e-posta ya da WhatsApp ile geri çekebileceği; sonrasında görsellerin [n] gün içinde kaldırılacağı
- Ayrı anlaşma olmadan ad, uyruk ya da başka kişisel bilgi gösterilmeyeceği
- Hastanın ödeme almadığı, ya da ne aldığı
- Tarih, imza ve hastaya kendi dilinde bir kopya

Saklama
- İmzalı form hasta dosyasıyla, vaka numarasıyla görsel dosyalarına bağlı olarak saklanır
- Yayınlanan vakaların tek bir listesi (tablo): vaka numarası, tedavi, nerede yayınlandığı, onay tarihi, varsa geri çekme tarihi

Yayınlamadan önce
- Formun imzalı olduğunu ve yayınlayacağınız şeyle eşleştiğini kontrol edin
- Açıklamada ad ya da tam yaş olmadığını kontrol edin
- Sonrası fotoğrafının tedavi gününden değil, oturmuş bir sonuçtan olduğunu kontrol edin

Avukatınıza sorun
- Yalnızca sizin değil, hastanın ülkesinin kişisel veri yasası
- Reşit olmayanlar ve kendi adına onay veremeyen hastalar
- Meslek kuruluşunuzun sonuç reklamı kuralları`,
        },
      ],
      mistakes: [
        "Öncesi ve sonrası için farklı açı ve ışık; hile gibi görünür",
        "Yalnızca sözlü onay ya da genel tedavi sözleşmesine gizlenmiş bir satır",
        "Açıklamasız galeri; hasta ne yapıldığını anlayamaz",
        "Şişlik inmeden, tedavi günü sonucu göstermek",
      ],
      done: "Her tedavi sayfası aynı standartta çekilmiş en az üç açıklamalı vaka gösteriyor ve herhangi birinin imzalı onayını bir dakikada çıkarabiliyorsunuz.",
    },
    {
      id: "booking",
      title: "İlgiden rezerve edilmiş konsültasyona açık bir yol",
      promise: "Bu bölümden sonra bir hasta herhangi bir sayfadan bir dakikanın altında konsültasyon talep edebilecek, anında bir onay alacak ve sonra ne olacağını tam olarak bilecek.",
      minutes: 5,
      why: [
        "Bazı hastalar WhatsApp yerine formu tercih eder; özellikle Avrupa ve Birleşik Krallık'ta ve özellikle başkası adına araştırma yapan aile üyesi. Tek seçenek sohbetse ertelerler ve ertelemek kaybetmek demektir.",
        "On bir soru soran ya da hastayı sessiz bir teşekkür sayfasına gönderen bir form, dolduranları bile kaybeder. Hasta bir şey olup olmadığını bilmez. Ertesi gün başkasına yazar.",
        "Çözüm: kısa bir form, sonra ne olacağını söyleyen bir teşekkür sayfası ve dakikalar içinde bir onay mesajı.",
      ],
      steps: [
        {
          title: "On beş değil, beş şey isteyin",
          body: "Ad, ülke, WhatsApp ya da telefon, ilgilenilen tedavi, tercih edilen seyahat ayı. Geri kalan her şey ilk cevapta sorulabilir. İsteğe bağlı fotoğraf yükleme diş ve saç için işe yarar; isteğe bağlı tutun.",
        },
        {
          title: "Formu kararın verildiği yere koyun",
          body: "Her tedavi sayfasının sonunda, fiyat ve SSS'den sonra, WhatsApp düğmesinin yanında. Ayrıca üst menüden bağlanan ayrı bir konsültasyon sayfasında, onu arayarak gelen hastalar için.",
        },
        {
          title: "Teşekkür sayfasını çalıştırın",
          body: "Gönderdikten sonra: 'Teşekkürler, [koordinatör] [süre] içinde WhatsApp'tan cevap verecek. Bu arada yolculuk şöyle görünüyor' ve yolculuk sayfasıyla doktor profiline bağlantı. Dönüşümleri saydığınız sayfa da burasıdır.",
        },
        {
          title: "Dakikalar içinde onay gönderin",
          body: "Hastanın dilinde, koordinatörün adı ve üç eleme sorusuyla bir e-posta ve mümkünse klinik numarasından bir WhatsApp mesajı. Aşağıdaki şablon o mesajdır.",
        },
        {
          title: "Talebi adı belli bir kişiye yönlendirin",
          body: "Her form gönderimi o dilin koordinatörüne, bir yedekle birlikte gider ve takip tablonuza işlenir (9. bölüm). Sahibi olmayan bir gelen kutusu, taleplerin öldüğü yerdir.",
        },
        {
          title: "'Sizi arayacağız' değil, bir saat önerin",
          body: "Görüntülü konsültasyonlar için hastanın bir saat seçmesine izin verin ya da ilk cevapta iki seçenek önerin. Somut bir saat, talebi randevuya çevirir.",
        },
      ],
      checklist: [
        "Tedavi ve seyahat ayı dahil beş alanlı form",
        "Her tedavi sayfasının sonunda ve bir konsültasyon sayfasında form",
        "Her dilde çalışıyor, hatalar o dilde gösteriliyor",
        "Teşekkür sayfası cevap süresini belirtiyor ve yolculuk sayfasına bağlanıyor",
        "Onay e-postası ve WhatsApp mesajı dakikalar içinde otomatik gönderiliyor",
        "Talep, yedeğiyle birlikte adı belli bir koordinatöre yönlendiriliyor",
        "İlk cevapta görüntülü konsültasyon saati öneriliyor",
        "Form gönderimleri analitikte dönüşüm olarak sayılıyor",
      ],
      templates: [
        {
          id: "inquiry-form",
          title: "Konsültasyon formu alanları ve teşekkür sayfası",
          kind: "text",
          note: "Alan etiketleri ve teşekkür metni. Sırayı koruyun; tedavi listesi tedavi sayfalarınızla eşleşmeli.",
          body: `Form başlığı: Yazılı planınızı alın

Alanlar
1. Adınız (metin, zorunlu)
2. Ülke (liste, zorunlu)
3. WhatsApp numarası ya da telefon (tel, zorunlu), ülke koduyla
4. Tedavi (liste, zorunlu): Diş implantı / All-on-4 / Lamine / Saç ekimi / Rinoplasti / Diğer
5. Ne zaman gelebilirsiniz? (liste, zorunlu): 1 ay içinde / 1 ila 3 ay / 3 ila 6 ay / Henüz belli değil
6. Fotoğraf ya da röntgen (dosya, isteğe bağlı, en fazla 3 dosya)
7. Doktorun bilmesini istediğiniz bir şey (metin, isteğe bağlı)
Onay satırı: "[Klinik]'in talebim hakkında benimle iletişime geçmesini kabul ediyorum." (onay kutusu, zorunlu)
Düğme: Talebimi gönder

Gizli alanlar (izleme için, 9. bölüm): sayfa URL'si, dil, utm_source, utm_medium, utm_campaign, gclid

Teşekkür sayfası
Başlık: Teşekkürler, [ad]. Talebiniz [koordinatör]'e ulaştı.
Metin: "[İstanbul saatiyle 09:00 ile 20:00 arasında 15 dakika] içinde WhatsApp'tan sizden haber alacağız. Eklemediyseniz [koordinatör] bir fotoğraf isteyecek ve doktorumuz yazılı planınızı [24 saat] içinde hazırlayacak."
Bağlantılar: Yolculuğunuz nasıl görünüyor [yolculuk sayfası] / [Dr. Ad] ile tanışın [profil]
İkincil: "Şimdi konuşmayı mı tercih edersiniz? WhatsApp'tan yazın." [düğme]`,
        },
        {
          id: "booking-confirmation",
          title: "Form gönderiminden sonra onay mesajı",
          kind: "message",
          note: "Klinik WhatsApp numarasından ya da e-postayla dakikalar içinde otomatik gönderilir, ardından bir insan devam eder.",
          body: `WhatsApp (TR):
Merhaba [ad], ben [Klinik]'ten [koordinatör]. [Tedavi] hakkındaki talebinizi aldım. Doktorumuzla planınızı hazırlayabilmem için bir fotoğraf [ya da röntgen] gönderip bugün sizi en çok neyin rahatsız ettiğini söyler misiniz? Fiyatı ve gün sayısını içeren yazılı planınız [24 saat] içinde elinizde olacak.

E-posta konusu (TR): [Klinik]'e talebiniz ulaştı

E-posta metni (TR):
Merhaba [ad],
[Tedavi] hakkındaki talebiniz için teşekkürler. Ben [koordinatör], vakanızla ben ilgileneceğim.
Sonraki adımlar:
1. [Süre] içinde [numara] üzerinden WhatsApp'tan size yazacağım.
2. Doktorumuz fotoğrafınızı inceleyip yazılı bir plan hazırlayacak: tedaviler, fiyat, İstanbul'da gün sayısı, dahil olanlar.
3. Planı beğenirseniz tarih öneririz ve uçuşunuzu alırsınız. Gerisini biz hallederiz.
Bu arada bu sayfa bütün yolculuğu anlatıyor: [yolculuk bağlantısı]
Saygılarımla,
[koordinatör], [Klinik]
[WhatsApp numarası] / [klinik adresi]

WhatsApp (EN):
Hello [name], this is [coordinator] from [Clinic]. I received your request about [treatment]. To prepare your plan with our doctor, could you send me a photo [or X-ray] and tell me what bothers you most today? You will have a written plan with the price and the number of days within [24 hours].`,
        },
      ],
      mistakes: [
        "On iki zorunlu alanlı ve tedavi listesi olmayan bir form",
        "'Mesaj gönderildi' deyip başka bir şey söylemeyen teşekkür sayfası",
        "Kimsenin sorumlu olmadığı ortak bir gelen kutusuna düşen talepler",
        "Bir sonraki iş günü gelen ilk cevap; o zamana kadar hastanın elinde üç teklif daha vardır",
      ],
      done: "Her dilde bir telefondan test talebi gönderin; dakikalar içinde onay gelir ve adı belli bir koordinatör talebi kaynağıyla birlikte takip tablosunda görür.",
    },
    {
      id: "tracking",
      title: "Her hastayı hangi sayfanın ve hangi reklamın getirdiğini bilin",
      promise: "Bu bölümden sonra her WhatsApp tıklaması, arama ve form sayılacak, her talep kaynağını taşıyacak ve rezervasyon yapan hastaları Google Ads'e geri gönderebileceksiniz; böylece bütçe kliniği dolduran reklamları izleyecek.",
      minutes: 9,
      why: [
        "İzleme olmadan site ve reklamlar hakkındaki her karar bir tahmindir. Toplam harcamayı ve hasta sayısını bilirsiniz ama hangi kampanyanın, hangi dilin ya da hangi sayfanın getirdiğini bilmezsiniz. Böylece bütçe, ajansın 'tıklama' diye raporladığı yere gitmeye devam eder.",
        "Açık iki yönde de pahalıdır: sohbet üretip rezervasyon üretmeyen kampanyalara ödemeye devam edersiniz ve tıklamaları pahalı göründüğü için sessizce en iyi hastaları getiren kampanyaları kesersiniz.",
        "Bu bölüm en teknik ve en değerli bölümdür. Tek başına takip tablosu, bir ay dürüstçe tutulursa, nasıl harcadığınızı değiştirir.",
      ],
      steps: [
        {
          title: "Tek bir analitik aracını düzgün kurun",
          body: "Google Tag Manager üzerinden Google Analytics 4; her dildeki her sayfada, hastanın tercihine saygı gösterecek şekilde çerez onay bandına bağlı. Tek mülk, tek konteyner. Eski pikselleri ve mükerrer etiketleri kaldırın.",
        },
        {
          title: "Önemli eylemleri sayın",
          body: "WhatsApp düğmesi, telefon bağlantıları ve form gönderimi (ya da teşekkür sayfası görüntülemesi) için tıklama olayları oluşturun. GA4'te bunları anahtar olay olarak işaretleyin. Hangi sayfaların sohbet ürettiğini görebilmek için sayfayı, dili ve tedaviyi parametre olarak geçirin.",
        },
        {
          title: "Kampanya bağlantılarını her seferinde aynı şekilde adlandırın",
          body: "Her reklam, e-posta ve sosyal medya bağlantısı tek bir küçük harf deseninde UTM parametreleri alır: utm_source, utm_medium, utm_campaign, utm_content. Aşağıdaki kural yeterlidir. Üç farklı şekilde yazılmış bir bağlantı raporlarınızda üç satır olur.",
        },
        {
          title: "Bir talep takip tablosu tutun",
          body: "Bir tablo, talep başına bir satır, şablondaki sütunlarla, talebi yürüten koordinatör tarafından doldurulur. 'Kaynak' ve 'rezervasyon?' sütunları bütün çabanın karşılığını veren iki sütundur. 'Durum' sütunu her pazartesi gözden geçirdiğiniz sütundur.",
        },
        {
          title: "Her talepte Google tıklama kimliğini yakalayın",
          body: "Google Ads'de otomatik etiketleme açıkken her reklam tıklaması açılış sayfası URL'sine bir gclid parametresi ekler. Bunu formda gizli bir alanda saklayın; WhatsApp talepleri için hastanın geldiği sayfayı ve kampanyayı kaydedin. Talep satırına yazın.",
        },
        {
          title: "Rezervasyon yapan hastaları Google Ads'e geri gönderin",
          body: "Haftada bir, rezervasyona dönüşen talepleri tıklama kimliği, zamanı ve değeriyle çevrimdışı dönüşüm olarak yükleyin. Aşağıdaki adımlar standarttır. Birkaç hafta sonra Google tıklama yerine rezervasyon yapan hasta için optimize edebilir.",
        },
        {
          title: "Her hafta tek sayfalık rakamları gözden geçirin",
          body: "Kaynağa, dile ve tedaviye göre talepler; aynı kırılımda rezervasyonlar; kampanya başına rezervasyon yapan hasta maliyeti. Pazartesi on beş dakika. Rezervasyon getirmeyeni kesin, bütçeyi getirene kaydırın.",
        },
      ],
      checklist: [
        "Tag Manager üzerinden GA4 her sayfada ve her dilde, çerez onayına saygılı",
        "WhatsApp, telefon ve form için tıklama olayları, anahtar olay olarak işaretlenmiş",
        "Olaylar sayfa, dil ve tedavi parametrelerini taşıyor",
        "Yazılı tek bir UTM kuralı, her kampanya bağlantısında kullanılıyor",
        "Talep başına bir satırlık takip tablosu, koordinatörlerin sorumluluğunda",
        "Google Ads otomatik etiketleme açık; her form talebinde gclid saklanıyor",
        "Rezervasyon yapan hastalar için haftalık çevrimdışı dönüşüm yüklemesi",
        "Kaynağa göre talep ve rezervasyonların haftalık 15 dakikalık incelemesi",
      ],
      templates: [
        {
          id: "lead-tracker",
          title: "Talep takip tablosu (CSV)",
          kind: "csv",
          note: "Yeni bir tabloya yapıştırın. Sütun başlıkları içe aktarmalarla uyumlu kalsın diye İngilizce. Durum değerleri: new, replied, plan sent, booked, arrived, lost. Değer, kendi para biriminizde plan toplamıdır.",
          body: `date,name,country,language,source,campaign,treatment,channel,status,booked,value,notes,gclid
2026-01-12,Sara M.,Suudi Arabistan,ar,google,ar-dental-implants-search,All-on-4,whatsapp,plan sent,no,,Refakatçi için otel sordu; perşembe takip,
2026-01-13,Thomas L.,Fransa,fr,meta,fr-hair-transplant-video,Saç ekimi FUE,form,booked,yes,2900,Seyahat 3 Mart; kapora ödendi,CjwKCA-ornek`,
        },
        {
          id: "ga4-events",
          title: "GA4 olay kontrol listesi",
          kind: "table",
          note: "Her birini Tag Manager'da oluşturun, sonra üç anahtar olayı GA4'te Yönetici > Etkinlikler altında işaretleyin. Yayınlamadan önce önizleme modunda test edin.",
          body: `| Olay adı | Ne zaman tetiklenir | Parametreler | Anahtar olay? |
|---|---|---|---|
| whatsapp_click | wa.me ya da api.whatsapp.com'a giden herhangi bir bağlantıya tıklandığında | page_path, language, treatment, button_position | Evet |
| call_click | Herhangi bir tel: bağlantısına tıklandığında | page_path, language, treatment | Evet |
| form_submit | Konsültasyon formu başarıyla gönderildiğinde (ya da teşekkür sayfası görüntülendiğinde) | page_path, language, treatment, form_id | Evet |
| form_start | Formun ilk alanına veri girildiğinde | page_path, language, treatment | Hayır |
| language_switch | Dil seçici kullanıldığında | from_language, to_language | Hayır |
| treatment_view | Tedavi sayfası görüntülendiğinde | treatment, language | Hayır |`,
        },
        {
          id: "utm-convention",
          title: "UTM adlandırma kuralı",
          kind: "text",
          note: "Küçük harf, boşluk yok, değerlerin içinde tire. Bir kez yazın, bağlantı oluşturan herkesle paylaşın.",
          body: `utm_source  = tıklamanın geldiği yer: google, meta, instagram, tiktok, youtube, email, whatsapp, partner-adi
utm_medium  = trafik türü: cpc, paid-social, organic-social, email, referral
utm_campaign = dil-tedavi-pazar-hedef, örn. ar-dental-implants-gulf-leads, fr-hair-transplant-fr-leads
utm_content = belirli reklam ya da yerleşim, örn. video-01, carousel-before-after, story-doctor
utm_term    = yalnızca arama reklamları için anahtar kelime grubu, örn. implant-fiyat

Örnek:
https://klinik.com/ar/dental-implants?utm_source=google&utm_medium=cpc&utm_campaign=ar-dental-implants-gulf-leads&utm_content=rsa-01

Kurallar
- Yayındaki bir kampanyanın adını asla değiştirmeyin; yenisini oluşturun
- Oluşturduğunuz her bağlantının tarih ve kim tarafından yapıldığıyla bir listesini tutun
- utm_campaign içindeki tedavi, indiği tedavi sayfasıyla eşleşmeli`,
        },
        {
          id: "offline-import",
          title: "Google Ads çevrimdışı dönüşüm içe aktarma, adım adım",
          kind: "text",
          note: "Standart Google Ads prosedürü. Geliştiriciniz ya da reklam yöneticiniz 1 ila 3. adımları bir kez yapar; 4. adımı bir koordinatör her hafta yapabilir.",
          body: `1. Otomatik etiketlemeyi açın
Google Ads > Yönetici > Hesap ayarları > Otomatik etiketleme: açık. Artık her reklam tıklaması açılış sayfası URL'nize ?gclid=... ekler.

2. Tıklama kimliğini web sitesinde yakalayın
Her forma gclid adında gizli bir alan ekleyin. Küçük bir script sayfa açılışında URL'den gclid'i okur, saklar (çerez ya da yerel depolama, 90 gün) ve gönderimde gizli alanı doldurur. WhatsApp talepleri için bunun yerine açılış sayfasını ve kampanyayı talep satırına yazın ve uzun vadeli seçenek olarak geliştiricinize potansiyel müşteriler için gelişmiş dönüşümleri (karma e-posta ya da telefon) sorun.

3. Dönüşüm işlemini oluşturun
Google Ads > Hedefler > Dönüşümler > Özet > Yeni dönüşüm işlemi > İçe aktar > CRM, dosya ya da başka veri kaynağı > Tıklamalardan gelen dönüşümleri izle. Adını "Rezervasyon yapan hasta" koyun. Kategori: Nitelikli potansiyel müşteri ya da Dönüşüm sağlayan potansiyel müşteri. Değer: dönüşüm başına farklı değerler kullan. Sayım: bir. Dönüşüm aralığı: 90 gün.

4. Her hafta yükleyin
Takip tablosundan booked = yes ve gclid'i olan satırları, tam olarak şu sütunlarla bir tabloya aktarın:
Google Click ID | Conversion Name | Conversion Time | Conversion Value | Conversion Currency
Conversion Time biçimi: yyyy-aa-gg ss:dd:ss, saat diliminizle (örn. "2026-01-20 14:35:00 Europe/Istanbul").
Google Ads > Hedefler > Dönüşümler > Yüklemeler > dosyayı yükleyin (ya da bir Google E-Tablo planlayın). Önizlemenin reddettiği satırları düzeltin.

5. Zaman tanıyın
Gerçek rezervasyonlarla 3 ila 4 haftalık yüklemeden sonra kampanyaları tıklama ya da ham potansiyel müşteri yerine "Rezervasyon yapan hasta" için teklif verecek şekilde değiştirin. Tıklama başına maliyeti değil, rezervasyon yapan hasta başına maliyeti izleyin.`,
        },
      ],
      mistakes: [
        "'Tıklama' ve 'potansiyel müşteri' raporlayıp asla 'rezervasyon' raporlamamak; reklamlar hiç seyahat etmeyen sohbetler için optimize olur",
        "Üç ajanstan, her biri farklı sayan üç analitik etiketi",
        "Elle, büyük harf ve boşluklarla yazılmış UTM bağlantıları",
        "Yalnızca ajansın doldurduğu bir takip tablosu; rezervasyonlar reklamlara asla geri dönmez",
      ],
      done: "Pazartesi günü tek bir tablodan her dilin ve her kampanyanın geçen hafta kaç talep ve kaç rezervasyon getirdiğini söyleyebiliyorsunuz ve Google Ads rezervasyon yapan hastaları dönüşüm olarak gösteriyor.",
    },
    {
      id: "feedback",
      title: "Bir sonraki hastayı getiren yorumlar ve takip",
      promise: "Bu bölümden sonra her memnun hastadan doğru anda yorum isteyen, her yoruma cevap veren ve hastalar eve döndükten sonra bağlantıyı koruyan basit bir rutininiz olacak; sitenin kanıtı her ay büyüyecek ve bölümün sonundaki 30 günlük plan bunların hepsini bir takvime dönüştürecek.",
      minutes: 7,
      why: [
        "Yurt dışındaki klinikleri karşılaştıran bir hasta, sayfalarınızı okumadan önce yorumları okur. Cevap verdiğiniz bir profilde tedavinin adı geçen on yeni yorum, yüz eski yorumdan ağır basar. Geçen haftaki bir yorum, kliniğin canlı olduğunun ve hâlâ çalıştığının kanıtıdır.",
        "Hasta eve uçtuktan sonraki takip, tavsiyelerin geldiği yerdir. Bir hafta, bir ay ve altı ay sonra klinikten haber alan hastalar arkadaşlarına anlatır. Ödemeden sonra hiçbir şey duymayan hastalar başka bir hikâye anlatır.",
        "Bunların hiçbiri yazılım gerektirmez. Önceden seçilmiş bir an, kaydedilmiş bir mesaj ve işi bu olan biri gerekir.",
      ],
      steps: [
        {
          title: "Anı seçin",
          body: "İstanbul'daki son randevuda, sonuç görünürken ve koordinatör odadayken ya da bir haftalık takip mesajında isteyin. İlk gün değil, üç ay sonra değil.",
        },
        {
          title: "Tek dokunuşluk bir bağlantı yapın",
          body: "Google İşletme Profili yorum formunuzun doğrudan bağlantısını ya da pazarınızın kullandığı platformu gönderin. Tedaviyi ve ülkelerini belirtmelerini isteyin; aynı ülkeden bir sonraki hastanın aradığı budur.",
        },
        {
          title: "Her yoruma bir hafta içinde cevap verin",
          body: "Adıyla teşekkür edin, tedaviyi adlandırın, bir kişisel satır. Olumsuz yorumlarda: özür dileyin, ne yaptığınızı söyleyin, konuşmayı WhatsApp'a taşıyın ve asla herkesin önünde tartışmayın. Gelecekteki hastalar yıldızlardan çok cevapları okur.",
        },
        {
          title: "Gerçek yorumları tedavi sayfalarına koyun",
          body: "Tedavi başına iki üç tane; ad, ülke ve tedaviyle, hastaların kontrol edebilmesi için orijinaline bağlantılı. Her çeyrek yenileyin.",
        },
        {
          title: "Takip takvimini işletin",
          body: "Bir hafta: nasılsınız, ağrı var mı, talimatları hatırlatma. Bir ay: kısa kontrol, henüz verilmediyse yorum isteme. Altı ay: güncel fotoğraf isteme ve tedavi düşünen bir arkadaş olup olmadığını sorma. Kaydedilmiş mesajlar, koordinatör tarafından gönderilir, takip tablosuna işlenir.",
        },
        {
          title: "Döngüyü sitede kapatın",
          body: "Her ay yeni vakaları galeriye, yeni yorumları sayfalara ve hastaların sorduğu soruları SSS'ye ekleyin. İyi bir site, yeniden tasarım olmadan böyle daha iyi olur.",
        },
      ],
      checklist: [
        "Yorum isteme anı belirlenmiş ve koordinatörün kontrol listesine yazılmış",
        "Tek dokunuşluk yorum bağlantısı her dilde hızlı cevap olarak kaydedilmiş",
        "Her yoruma bir hafta içinde ad ve tedaviyle cevap verilmiş",
        "Olumsuz yorumlar sakince cevaplanmış ve WhatsApp'a taşınmış",
        "Her tedavi sayfasında bağlantılı iki üç yorum",
        "Bir hafta, bir ay ve altı aylık takip mesajları kaydedilmiş ve gönderiliyor",
        "Takipler talep takip tablosuna işleniyor",
        "Sitede galeri, yorumlar ve SSS aylık güncelleniyor",
      ],
      templates: [
        {
          id: "review-request",
          title: "Yorum isteme ve takip mesajları",
          kind: "message",
          note: "Klinik WhatsApp numarasından gönderin. Bağlantıyı kendi doğrudan yorum bağlantınızla değiştirin.",
          body: `Yorum isteme, son randevu ya da bir hafta sonra (TR):
Merhaba [ad], sizinle ilgilenmek bizim için bir zevkti. [Tedavi]'nizden memnunsanız kısa bir yorum, şu an karar vermeye çalışan [ülke]'deki hastalara yardımcı olur. Bir dakika sürüyor: [yorum bağlantısı]. Mümkünse tedaviyi ve nereden geldiğinizi belirtin. Teşekkürler, [koordinatör].

Bir haftalık takip (TR):
Merhaba [ad], eve döneli bir hafta oldu. Nasıl hissediyorsunuz? Ağrı, şişlik ya da talimatlarla ilgili bir sorunuz var mı? İstediğiniz zaman buradan yazın; [Dr. Ad] mesajlarınızı aynı gün görüyor.

Bir aylık takip (TR):
Merhaba [ad], bir ay oldu bile. Her şey yerine oturuyor mu? Bir dakikanız varsa bir fotoğraf, doktorun buradan kontrol etmesine yardımcı olur. Yoruma vakit bulamadıysanız bağlantı burada: [yorum bağlantısı].

Altı aylık takip (TR):
Merhaba [ad], [tedavi]'nizin üzerinden altı ay geçti. Dosyanız için güncel bir fotoğraf almak isteriz. Bir arkadaşınız ya da aileden biri İstanbul'da tedavi düşünüyorsa onlar için de memnuniyetle plan hazırlarız; bu numarayı iletmeniz yeterli.

Olumlu yoruma cevap (TR):
Teşekkürler, [ad]. [Tedavi]'nizle ilgilenmek bizim için bir zevkti; İstanbul'dan dönüşünüzün rahat geçtiğini umuyoruz. Ekip selam gönderiyor, altı aylık fotoğrafınızı bekliyoruz.

Olumsuz yoruma cevap (TR):
[Ad], bize söylediğiniz için teşekkürler; böyle bir deneyim yaşadığınız için üzgünüm. Dosyanıza baktım ve [ne yaptığınız ya da yapacağınız]. Bunu düzgün biçimde çözmek istiyorum; size yardımcı olabilmem için lütfen bana doğrudan [numara] üzerinden yazın. [Ad, görev].

Yorum isteme (EN):
Hello [name], it was a pleasure to look after you. If you are happy with your [treatment], a short review helps patients from [country] who are deciding now. It takes a minute: [review link]. Thank you, [coordinator].`,
        },
        {
          id: "plan-30-days",
          title: "30 günlük plan (ve haftada 2 saatlik sürümü)",
          kind: "text",
          note: "Dört hafta, talepleri en hızlı hareket ettiren sırayla. Kısa sürüm haftada yalnızca iki saat ayırabilen yönetici için.",
          body: `1. hafta: Yakala (3. ve 8. bölümler)
- WhatsApp Business numarası, profil, saatler, her dilde uzaktayım mesajı
- Her tedavi sayfasında hazır mesajlı düğme, telefonda altta sabit
- İlk cevap metinleri kaydedilmiş; cevap standardı siteye yazılmış
- Form beş alana indirilmiş; teşekkür sayfası ve onay mesajı yayında
- Talep takip tablosuna bugün başlayın, kâğıt üzerinde bile olsa

2. hafta: Cevapla (5. ve 2. bölümler)
- Taslakla yeniden yazılmış bir tedavi sayfası: başlangıç fiyatı, dahil olanlar, günler, doktor, SSS
- Fiyat tablosu eklenmiş
- Koordinatörlerin on sorusundan yazılmış yolculuk sayfası
- Her tedavi sayfasında üç satırlık yolculuk özeti

3. hafta: Güven (6., 7. ve 10. bölümler)
- Kontrol edilebilir olgularla doktor profilleri; üstünlük ifadeleri kaldırılmış
- Tedavi odalarında standart çekim kartları; onay formu avukatta
- Yorum bağlantısı kaydedilmiş; bekleyen her yorum cevaplanmış; takip mesajları kaydedilmiş

4. hafta: Ölç ve hızlandır (9., 4. ve 1. bölümler)
- WhatsApp, arama ve form için GA4 olayları; UTM kuralı paylaşılmış
- Otomatik etiketleme açık; gclid yakalanıyor; ilk çevrimdışı yükleme yapılmış
- Görseller sıkıştırılmış, video ve slider'lar kaldırılmış, hız günlüğü başlatılmış
- İlk dil için çeviri brief'i gönderilmiş; kalan sayfalar planlanmış

Haftada yalnızca 2 saatiniz varsa
- 1. hafta: her tedavi sayfasında hazır mesajlı WhatsApp düğmesi; ilk cevap metni
- 2. hafta: bir tedavi sayfasını (en çok sattığınız tedavi) fiyat, günler ve SSS ile yeniden yazın
- 3. hafta: talep takip tablosuna başlayın; ayrılan her hastadan yorum isteyin
- 4. hafta: görselleri sıkıştırın ve giriş videosunu kaldırın; GA4 olayları için geliştiricinizden randevu alın
Geri kalan her şey ikinci aya; haftada bir bölüm, en düşük denetim cevabından başlayarak.`,
        },
      ],
      mistakes: [
        "Yorumları bir ay sonra, an geçtikten sonra e-postayla istemek",
        "Olumsuz yorumları cevapsız bırakmak ya da tartışarak cevaplamak",
        "Sitede adsız, ülkesiz ve bağlantısız, uydurma gibi okunan referanslar",
        "Ödemeden sonra hiç temas kurmamak; üç arkadaşını yönlendirecek hasta hiçbirini yönlendirmez",
      ],
      done: "Geçen ay ayrılan her hastadan kararlaştırılan anda yorum istenmiş, her yorumun cevabı var ve bir haftalık takip zamanında gitmiş.",
    },
  ],
  quickWins: [
    "En çok ziyaret edilen tedavi sayfanıza telefonda altta sabit, hazır mesajlı bir WhatsApp düğmesi ekleyin",
    "Her dilde üç eleme sorulu ilk cevap metnini yazın ve kaydedin",
    "WhatsApp Business saatlerini ve fotoğraf ile ülke isteyen bir uzaktayım mesajını ayarlayın",
    "En çok sattığınız tedavi sayfasına üç dahil kalemiyle bir başlangıç fiyatı koyun",
    "Her tedavi sayfasına üç satır ekleyin: İstanbul'da gün sayısı, dönüş günü, dahil olanlar",
    "'En iyi klinik' ve 'dünya standartlarında' ifadelerini birer kontrol edilebilir olguyla değiştirin",
    "En ağır on görseli 200 KB altında WebP'ye sıkıştırın",
    "Giriş videosunu kaldırıp yerine tek bir fotoğraf koyun",
    "İletişim formunu beş alana indirin ve cevap süresini belirten bir teşekkür sayfası yazın",
    "Talep takip sütunlarıyla bir tablo açın ve bugünün taleplerini işleyin",
  ],
  summary: [
    "Yurt dışındaki hastalar kimseyle iletişime geçmeden önce telefonda, kendi dillerinde, web sitelerinden ön eleme yapar.",
    "İlk mesaj neredeyse her zaman bir tedavi sayfasından WhatsApp ile gelir; düğmeyi oraya, hazır mesajla koyun.",
    "'Nasıl yardımcı olabiliriz' ile değil, dakikalar içinde üç soruyla cevap verin.",
    "Fiyatı ve günleri açıkça söyleyin: dahil olanlarıyla başlangıç fiyatı, İstanbul'da gün sayısı, ne zaman dönecekleri.",
    "Tek bir sayfa bütün yolculuğu hastanın sırasıyla, her aşamada adı belli bir kişiyle anlatır.",
    "Güven kontrol edilebilir olgularla kurulur: adı verilmiş doktorlar, bağlantılı akreditasyonlar, onaylı ve açıklamalı sonuçlar.",
    "Hız diğer her şeyi korur: gerçek bir telefonda 2,5 saniyenin altında tedavi sayfaları.",
    "Tıklamaları izleyin, her talebi kaynağıyla kaydedin, rezervasyon yapan hastaları her hafta Google Ads'e geri gönderin.",
    "Yorumu son randevuda isteyin; bir hafta, bir ay ve altı ay sonra takip edin.",
    "Kendiniz yapmak yerine yaptırmak isterseniz: Klinik Web Sitesi paketi 1 ila 8. bölümleri kurar, Klinik Büyüme Sistemi ise 9 ve 10. bölümlerdeki izleme, CRM ve reklam bağlantısını ekler.",
  ],
};
