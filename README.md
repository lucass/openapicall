
Wtyczka do Thunderbird'a.
=========================

Zaprezentuje tu jak w kilku prostych krokach, kilku plikach xml, css i js stworzyć wtyczkę do Thunderbird'a
umożliwiającą zestawianie połączeń pomiędzy osobami, które mamy w książce telefonicznej.

Do obsługi usług komórkowych wykorzystam [Open API](https://developers.t-mobile.pl/).

Nie napiszę jak należy to zrobić (odpowiedzi można poszukać [tu][1]).
Napiszę jak ja to zrobiłem.

Struktura katalogu.
-------------------

Aby dodać wtyczkę/rozszerzenie do Thunderbird'a trzeba dodać katalog (z plikami składającymi się na rozszerzenie) 
w katalogu gdzie Thunderbird trzyma swoje rozszerzenia.

U mnie wygląda to tak:


    lucass@e:~/.thunderbird/adyg80aq.default/extensions$ tree
    .
    `-- openapicall@touk.pl
        |-- chrome
        |   |-- button.css
        |   |-- button.js
        |   |-- button.png
        |   |-- button.xul
        |   `-- icon.jpg
        |-- chrome.manifest
        |-- install.rdf
        `-- options.xul
    
    2 directories, 8 files


Ten dziwny ciąg znaczków `adyg80aq.default` to nazwa profilu, którą każdy powinien mieć inną.

openapicall@touk.pl 
-------------------

To jest nazwa katalogu z rozszerzeniem. Jest to zarazem identyfikator rozszerzenia (a więc powinien być unikalny w stosunku do innych rozszerzeń).
Choć wygląda jak adres e-mail (@ jest wymagany, można używać tylko małych liter) to jednak adresem e-mail być nie musi.
    
install.rdf
-----------

    <?xml version="1.0"?> 
    
    <RDF xmlns="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:em="http://www.mozilla.org/2004/em-rdf#">
        
        <Description about="urn:mozilla:install-manifest">
    
            <em:id>openapicall@touk.pl</em:id>
            <em:name>oAC</em:name>
            <em:description>openApi Call</em:description>
            <em:version>1.0</em:version> 
            <em:creator>lpj</em:creator>
            <em:homepageURL>https://github.com/lucass/openapicall</em:homepageURL>
            <em:iconURL>chrome://openapicall/content/icon.jpg</em:iconURL> 
    
            <em:targetApplication>
                <Description>
                    <em:id>{3550f703-e582-4d05-9a08-453d09bdfdc6}</em:id>
                    <em:minVersion>1.4</em:minVersion>
                    <em:maxVersion>99</em:maxVersion> 
                </Description>
            </em:targetApplication> 
            
        </Description> 
    
    </RDF>

Plik ten zawiera ogólne informacje na temat rozszerzenia.
   
Znaczenie tagów name, description, version, creator, homepageURL jest jasne. Zajmiemy się pozostałym:

*   `id` - identyfikator rozszerzenia - zbieżność z nazwą katalogu, w którym umieszczamy pliki rozszerzenia nie jest przypadkowa - to muszą być te same wartości,
*   `iconURL` - ikona, która pojawi się na liście rozszerzeń w menu Tool Thunderbird'a - żeby ładnie wyglądało,
*   `targetApplication` - określenie jaką aplikacje rozszerzamy:
    *   `[min|max]Version` - zakres wersji aplikacji,
    *   `id` - identyfikator - o szczegółach można poczytać [tu][2].

Tagi `id`, `name`, `version` i `targetApplication` są wymagane. Reszta jest opcjonalna. Informacje o innych rzeczach, które można, należy bądź 
powinno się umieścić w pliku `install.rdf` można znaleźć [tu][3].
   
chrome.manifest
---------------

    content openapicall chrome/
    style chrome://global/content/customizeToolbar.xul chrome://openapicall/content/button.css 
    overlay chrome://messenger/content/addressbook/addressbook.xul chrome://openapicall/content/button.xul 

W tym pliku możemy przeczytać co właściwie rozszerzamy.

* linia pierwsza mówi, że zawartość rozszerzenia jest w podkatalogu `chrome/`
* w linii drugiej podajemy używane style css
* ostatnia linia mówi co rozszerzamy

### XUL - co to takiego?

XUL (XML User Interface Language) to sposób opisu interfejsu użytkownika używany przez mozille w swoich aplikacjach.
Przy pomocy tagów XML'a definiujemy komponenty interfejsu.

Jedną z przydatnych cech XUL'a jest łatwość jego rozszerzania (czyli overlay).

A więc linia druga mówi, że w miejscu gdzie zdefiniowany będzie customizeToolbar należy dodać nasze style.
A trzecia linia mówi, że `addressbook.xul` trzeba połączyć z `button.xul` zdefiniowanym przez nasze rozszerzenie.

Bardziej szczegółowe informacje można znaleźć [tu][4].
    
options.xul
-----------

    <?xml version="1.0"?>  
      
    <!DOCTYPE mydialog SYSTEM "chrome://myaddon/locale/mydialog.dtd">  
      
    <vbox xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">  
        <setting type="string" pref="extensions.openapicall.number" title="Numer telefonu" desc="Numer twojego telefonu" />  
        <setting type="string" pref="extensions.openapicall.appcode" title="AppKey" desc="Kod aplikacji" /> 
        <setting type="menulist" pref="extensions.openapicall.telephonekind" title="Rodzaj numeru telefonicznego odbiorcy" desc="Z którym numerem będziemy zestawiać połączenie">  
            <menulist>  
                <menupopup>  
                    <menuitem value="1" label="komórkowy"/>  
                    <menuitem value="2" label="służbowy"/>  
                    <menuitem value="3" label="domowy"/>  
                </menupopup>  
            </menulist>  
        </setting>  
    </vbox>  

W pliku `options.xul` określamy parametry, które można podać w szczegółach rozszerzenia.
Podajemy nazwę i opis dla użytkownika `title`, `desc`, typ parametru `type` oraz identyfikator `pref`.
    
button.(css|png)
----------------

    #custom-button-1, #wrapper-custom-button-1 {   
        list-style-image: url("chrome://openapicall/content/button.png");
    } 
    
    .custombutton {
        -moz-image-region: rect( 0px 24px 24px  0px);
    } 
    
    .custombutton:hover {
        -moz-image-region: rect(24px 24px 48px  0px);
    } 
    
    [iconsize="small"] .custombutton {
        -moz-image-region: rect( 0px 40px 16px 24px);
    } 
    
    [iconsize="small"] .custombutton:hover {
        -moz-image-region: rect(24px 40px 40px 24px);
    }

Przy pomocy plików button.png i button.css określamy wygląd przycisku. 

Użytkownik Thunderbird'a może określić preferowany 
wygląd (ikona, ikona plus tekst, sam tekst) oraz wielkość (mała/duża) elementów. Plik png składa się z czterech części. 
Dwie małe i dwie duże wersje ikony. Jedna ikona z pary to normalny wygląd ikony, druga to wersja, którą pokaże się po
najechaniu na ikonę myszką.

button.xul
----------

    <?xml version="1.0" encoding="UTF-8"?>
    
    <?xml-stylesheet type="text/css" href="chrome://openapicall/content/button.css"?> 
    
    <!DOCTYPE overlay >
    
    <overlay id="custombutton-overlay" xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"> 
    
        <script type="application/javascript" src="chrome://openapicall/content/button.js"/> 
        
        <toolbarpalette id="AddressBookToolbarPalette"> 
            <toolbarbutton id="custom-button-1"/> 
        </toolbarpalette> 
    
        <toolbarbutton id="custom-button-1" label="Call" tooltiptext="openApi Call" oncommand="CustomButton[1]()" class="toolbarbutton-1 chromeclass-toolbar-additional custombutton" /> 
    
    </overlay>

W pliku tym mamy zdefiniowane rozszerzenie `AddressBookToolbarPalette` (czyli miejsca gdzie znajduję się rzeczy, które możemy dodać do Toolbar'a) 
przez nasz kawałek xul'a, który zawiera definicję przycisku `toolbarbutton` wzbogaconą o zdefiniowane przez nas style.
    
button.js
---------

Użytkownik wtyczki w menu dodatków do Thunderbird'a ustawia: 

* kod aplikacji,
* swój numer telefonu,
* wybiera rodzaj numeru telefonu (komórkowy, służbowy bądź domowy) odbiorcy.

Na podstawie tych danych tworzone są po kliknięciu w przycisk odpowiednie url'e wywołujące funkcje openAPI:

    const CORE_API = "https://developers.t-mobile.pl/api/"
    
    const PERMISSION_LIST = CORE_API + "permission/list"     
    const PERMISSION_GET = CORE_API + "permission/get"
    const TELEPHONY_SETUP_CALL = CORE_API + "telephony/setup_call"
    const PERMISSION_TIME = "10"
    
    let prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService)
    let branch = prefs.getBranch("extensions.openapicall.")
    
    ...
     
    let numberFrom = branch.getCharPref("number")
    let appcode = branch.getCharPref("appcode")
        
    let permissionList = PERMISSION_LIST + "?appkey=" + appcode + "&target=48" + numberFrom 
    let permissionGet = PERMISSION_GET + "?appkey=" + appcode + "&target=48" + numberFrom + "&permissions=call_on_behalf&period=" + PERMISSION_TIME   
    
Następnie sprawdzamy czy odpowiedni numer aktywnego kontaktu jest zdefiniowany:

    let telephonekind = branch.getIntPref("telephonekind")
    
    let numberNode
    
    if (telephonekind == 1)
        numberNode = document.getElementById("cvPhCellular").textContent
    else if (telephonekind == 2)
        numberNode = document.getElementById("cvPhWork").textContent
    else if (telephonekind == 3)
        numberNode = document.getElementById("cvPhHome").textContent

I jeżeli numer jest zdefiniowany, próbujemy zestawić połączenie:

    if (numberNode != "") {
        let numberTo = numberNode.split(":")[1].trim()
        let telephonySetupCall = TELEPHONY_SETUP_CALL + "?appkey=" + appcode + "&from=48" + numberFrom + "&to=48" + numberTo   
        getHttp(permissionList, permissionGet, telephonySetupCall)
     } else
        alert("Numer telefonu nie jest zdefiniowany")
    
Aby wywołać funkcje openAPI używamy XMLHttpRequest wywoływanego asynchronicznie, żeby nie blokować interfejsu użytkownika do
momentu zakończenia przetwarzania. Po całkowitym pobraniu danych sterowanie przekazywane jest do wywołania zwrotnego 
(tzw. callback), ustawianego podczas tworzenia obiektu XMLHttpRequest.

Najpierw pobieramy listę uprawnień:

    function getHttp(permissionList, permissionGet, setupCallUrl) {
        let request = new XMLHttpRequest();
        request.open('GET', permissionList, true); 
        request.onreadystatechange = callCallback.bind(request, request, setupCallUrl, permissionGet);
        request.send(null); 
    }

i szukamy tam zgody na zestawianie połączeń (call_on_behalf). 
    
    function callCallback(request, setupCallUrl, permissionGet) {
        if (request.readyState == 4) {
            if (request.status == 200) {
                let xPathResult = evaluateXPath(request.responseXML, "/api/request/permission/type/text()");
                ...
           } 
       }
    } 
    
Jeżeli nie znajdujemy zgody, to po wyświetleniu komunikatu wywołujemy permissionGet, które spowoduje wysłanie sms'a (odesłanie 
odpowiedniego kodu z tego sms'a jest równoważne wyrażeniu zgody na zestawianie połączeń).

    if (xPathResult.indexOf("call_on_behalf") == -1) {
        alert("Nie wyraziłeś zgody na zestawianie połączeń")
        let callOnBehalf = new XMLHttpRequest()
        callOnBehalf.open('GET', permissionGet, true)
        callOnBehalf.send(null);
    } else {
        ...
    }

Jeżeli wśród listy uprawnień mamy zgodę na zestawianie połączeń - zestawiamy połączenie.
 
    if (xPathResult.indexOf("call_on_behalf") == -1) {
        ...
    } else {
        let setupCall = new XMLHttpRequest();
        setupCall.open('GET', setupCallUrl, true)
        setupCall.send(null)
    }
    
Co zrobić, żeby zainstalować nasze rozszerzenie.
------------------------------------------------

* należy katalog openapicall@touk.pl umieścić w katalogu z rozszerzeniami
* uruchomić Thunderbird'a
* zgodzić się na zainstalowanie wtyczki i zrestartować aplikacje 
* w menu Tools->Add-ons dodać parametry AppKey i Numer telefonu 
* w widoku Address Book dodać nasz przycisk (View->Toolbar->Customize...) przeciągając go na odpowiednie pole 
* przeglądając kontakty kliknąc na przycisk 

Co zostało pominięte:
---------------------

* wtyczkę budujemy w katalogu extensions, "normalne" wtyczki dostarczane są jako spakowane archiwum xpi 
* wtyczki można lokalizować, tzn dodać opisy, komunikaty zależnie od preferencji językowych użytkownika
* brakuje walidacji - zakładamy poprawność numerów i kodu aplikacji 

[1]: https://developer.mozilla.org
[2]: https://addons.mozilla.org/en-US/firefox/pages/appversions/
[3]: https://developer.mozilla.org/en/Install_Manifests 
[4]: https://developer.mozilla.org/en/Chrome_Registration 
