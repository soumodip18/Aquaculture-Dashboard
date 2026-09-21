document.querySelectorAll(".tabbtn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tabbtn").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".reportpanel").forEach(p=>p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

(function(){
  var menu = document.getElementById("mobileMenu");
  var openBtn = document.getElementById("menuOpen");
  var closeBtn = document.getElementById("menuClose");

  if(!menu || !openBtn || !closeBtn) return;

  function open(){
    menu.classList.add("open");
    openBtn.setAttribute("aria-expanded","true");
    document.body.style.overflow="hidden";
  }

  function close(){
    menu.classList.remove("open");
    openBtn.setAttribute("aria-expanded","false");
    document.body.style.overflow="";
  }

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  menu.querySelectorAll("a").forEach(a=>{
    a.addEventListener("click", close);
  });

  document.addEventListener("keydown", e=>{
    if(e.key==="Escape") close();
  });
})();

(function(){
  var selectors = [
    ".section-head",
    ".block h2",
    ".block .section-sub",
    ".ledger .wrap > div",
    ".calendar",
    ".tabbar",
    ".repo-row",
    ".tcard",
    ".mentor-row",
    ".pstep",
    ".sstep",
    ".dim-card",
    ".fact-card",
    ".credit-block",
    ".disclaimer"
  ].join(",");

  var targets = Array.prototype.slice.call(
    document.querySelectorAll(selectors)
  );

  if(!targets.length) return;

  targets.forEach(function(el, i){
    el.classList.add("reveal");
    el.style.transitionDelay =
      (Math.min(i % 6, 6) * 0.07) + "s";
  });

  if(!("IntersectionObserver" in window)){
    targets.forEach(function(el){
      el.classList.add("in-view");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  targets.forEach(function(el){
    observer.observe(el);
  });
})();


(function(){

  // ==========================================
  // GOOGLE FORM LEAD COLLECTION
  // ==========================================

  var GOOGLE_FORM_ACTION_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdR1RAxDlvAy6PKdAmEHJSh4sXxdj1oVQ-JQvyY1Isog6cU8A/formResponse";

  var ENTRY_NAME_ID = "entry.406654044";
  var ENTRY_EMAIL_ID = "entry.1232579021";


  function submitLead(name, email, file){

    var formData = new FormData();

    formData.append(
      ENTRY_NAME_ID,
      name
    );

    formData.append(
      ENTRY_EMAIL_ID,
      email
    );

    /*
      Google Forms does not allow the browser
      to read the response cross-origin.

      Therefore no-cors is used.
    */

    fetch(
      GOOGLE_FORM_ACTION_URL,
      {
        method: "POST",
        mode: "no-cors",
        body: formData
      }
    ).catch(function(){});

  }


  // ==========================================
  // DOWNLOAD GATE ELEMENTS
  // ==========================================

  var overlay =
    document.getElementById("gateOverlay");

  var form =
    document.getElementById("gateForm");

  var nameInput =
    document.getElementById("gateName");

  var emailInput =
    document.getElementById("gateEmail");

  var errorBox =
    document.getElementById("gateError");

  var filenameBox =
    document.getElementById("gateFilename");

  var pendingLink = null;


  // ==========================================
  // CHECK DOWNLOAD LINKS
  // ==========================================

  function isDownloadLink(a){

    if(!a || a.tagName !== "A"){
      return false;
    }

    return a.hasAttribute("data-href");
  }


  // ==========================================
  // OPEN DOWNLOAD FORM
  // ==========================================

  document.addEventListener(
    "click",
    function(e){

      var a = e.target.closest("a");

      if(!isDownloadLink(a)){
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      pendingLink = a;

      var label =
        a.getAttribute("download") ||
        a.textContent.trim() ||
        "this file";

      filenameBox.textContent = label;

      errorBox.style.display = "none";

      nameInput.value = "";
      emailInput.value = "";

      overlay.classList.add("open");

      nameInput.focus();

    },
    true
  );


  // ==========================================
  // CANCEL DOWNLOAD
  // ==========================================

  document
    .getElementById("gateCancel")
    .addEventListener(
      "click",
      function(){

        overlay.classList.remove("open");

        pendingLink = null;

      }
    );


  // ==========================================
  // CLOSE WHEN CLICKING OUTSIDE MODAL
  // ==========================================

  overlay.addEventListener(
    "click",
    function(e){

      if(e.target === overlay){

        overlay.classList.remove("open");

        pendingLink = null;

      }

    }
  );


  // ==========================================
  // DATA URI → BLOB URL
  // ==========================================

  function dataUriToBlobUrl(dataUri){

    var comma =
      dataUri.indexOf(",");

    var meta =
      dataUri.substring(
        0,
        comma
      );

    var mime =
      meta.substring(
        meta.indexOf(":") + 1,
        meta.indexOf(";")
      );

    var binary =
      atob(
        dataUri.substring(
          comma + 1
        )
      );

    var len =
      binary.length;

    var bytes =
      new Uint8Array(len);

    for(
      var i = 0;
      i < len;
      i++
    ){

      bytes[i] =
        binary.charCodeAt(i);

    }

    return URL.createObjectURL(
      new Blob(
        [bytes],
        {
          type: mime
        }
      )
    );

  }


  // ==========================================
  // TRIGGER FILE DOWNLOAD
  // ==========================================

  function triggerDownload(link){

    var filename =
      link.getAttribute("download") ||
      "download";

    var realHref =
      link.getAttribute("data-href");

    var url =
      realHref;

    var isBlob =
      false;


    try{

      if(
        realHref.indexOf("data:") === 0
      ){

        url =
          dataUriToBlobUrl(
            realHref
          );

        isBlob =
          true;

      }

    }
    catch(err){

      url =
        realHref;

    }


    var real =
      document.createElement("a");

    real.href =
      url;

    real.download =
      filename;

    real.style.display =
      "none";

    document.body.appendChild(
      real
    );

    real.click();

    document.body.removeChild(
      real
    );


    if(isBlob){

      setTimeout(
        function(){

          URL.revokeObjectURL(
            url
          );

        },
        10000
      );

    }

  }


  // ==========================================
  // SUBMIT DOWNLOAD FORM
  // ==========================================

  form.addEventListener(
    "submit",
    function(e){

      e.preventDefault();


      var name =
        nameInput.value.trim();

      var email =
        emailInput.value.trim();


      var emailOk =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);


      if(!name || !emailOk){

        errorBox.style.display =
          "block";

        return;

      }


      var fileLabel =
        pendingLink
          ? (
              pendingLink.getAttribute(
                "download"
              ) ||
              "unknown file"
            )
          : "unknown file";


      // ========================================
      // LOCAL BACKUP LOG
      // ========================================

      try{

        var log =
          JSON.parse(
            localStorage.getItem(
              "aquabasDownloadLog"
            ) || "[]"
          );


        log.push({

          name:
            name,

          email:
            email,

          file:
            fileLabel,

          time:
            new Date().toISOString()

        });


        localStorage.setItem(
          "aquabasDownloadLog",
          JSON.stringify(log)
        );

      }
      catch(err){}


      // ========================================
      // SEND TO GOOGLE FORM
      // ========================================

      submitLead(
        name,
        email,
        fileLabel
      );


      // ========================================
      // CLOSE MODAL
      // ========================================

      overlay.classList.remove(
        "open"
      );


      // ========================================
      // START DOWNLOAD
      // ========================================

      if(pendingLink){

        triggerDownload(
          pendingLink
        );

        pendingLink = null;

      }

    }
  );


  // ==========================================
  // BUILT-IN LEADS VIEWER
  // URL:
  // ?leads=1
  // ==========================================

  if(
    /[?&]leads=1\b/.test(
      location.search
    )
  ){

    var savedLog = [];

    try{

      savedLog =
        JSON.parse(
          localStorage.getItem(
            "aquabasDownloadLog"
          ) || "[]"
        );

    }
    catch(err){}


    // ========================================
    // CREATE LEADS PANEL
    // ========================================

    var panel =
      document.createElement(
        "div"
      );


    panel.style.cssText =
      "position:fixed;" +
      "inset:0;" +
      "background:#fffdf8;" +
      "z-index:999;" +
      "overflow:auto;" +
      "padding:28px;" +
      "font:14px/1.5 Inter,Arial,sans-serif;" +
      "color:#112f37";


    // ========================================
    // CREATE TABLE ROWS
    // ========================================

    var rows =
      savedLog.map(
        function(r){

          return (

            "<tr>" +

            "<td style=\"" +
            "padding:6px 10px;" +
            "border-bottom:1px solid #dfe6de\">" +

            r.name +

            "</td>" +


            "<td style=\"" +
            "padding:6px 10px;" +
            "border-bottom:1px solid #dfe6de\">" +

            r.email +

            "</td>" +


            "<td style=\"" +
            "padding:6px 10px;" +
            "border-bottom:1px solid #dfe6de\">" +

            r.file +

            "</td>" +


            "<td style=\"" +
            "padding:6px 10px;" +
            "border-bottom:1px solid #dfe6de\">" +

            r.time +

            "</td>" +

            "</tr>"

          );

        }
      ).join("");


    // ========================================
    // PANEL HTML
    // ========================================

    panel.innerHTML =

      "<h2 style=\"" +
      "font-family:Manrope,Arial,sans-serif;" +
      "margin-bottom:6px\">" +

      "Download sign-ups (this browser)" +

      "</h2>" +


      "<p style=\"" +
      "color:#5f7679;" +
      "margin-bottom:16px\">" +

      savedLog.length +
      " record(s) stored locally." +


      "<button id=\"leadsExport\" " +
      "style=\"" +
      "margin-left:12px;" +
      "padding:8px 14px;" +
      "border-radius:8px;" +
      "border:1px solid #06252e;" +
      "background:#06252e;" +
      "color:#fff;" +
      "cursor:pointer\">" +

      "Download CSV" +

      "</button>" +


      "<button id=\"leadsClose\" " +
      "style=\"" +
      "margin-left:8px;" +
      "padding:8px 14px;" +
      "border-radius:8px;" +
      "border:1px solid #06252e;" +
      "background:transparent;" +
      "color:#06252e;" +
      "cursor:pointer\">" +

      "Close" +

      "</button>" +

      "</p>" +


      "<table style=\"" +
      "border-collapse:collapse;" +
      "width:100%;" +
      "max-width:900px\">" +

      "<thead>" +

      "<tr>" +

      "<th style=\"" +
      "text-align:left;" +
      "padding:6px 10px;" +
      "border-bottom:2px solid #06252e\">" +

      "Name" +

      "</th>" +


      "<th style=\"" +
      "text-align:left;" +
      "padding:6px 10px;" +
      "border-bottom:2px solid #06252e\">" +

      "Email" +

      "</th>" +


      "<th style=\"" +
      "text-align:left;" +
      "padding:6px 10px;" +
      "border-bottom:2px solid #06252e\">" +

      "File" +

      "</th>" +


      "<th style=\"" +
      "text-align:left;" +
      "padding:6px 10px;" +
      "border-bottom:2px solid #06252e\">" +

      "Time" +

      "</th>" +

      "</tr>" +

      "</thead>" +


      "<tbody>" +

      rows +

      "</tbody>" +

      "</table>";


    document.body.appendChild(
      panel
    );


    // ========================================
    // CLOSE LEADS PANEL
    // ========================================

    document
      .getElementById("leadsClose")
      .addEventListener(
        "click",
        function(){

          panel.remove();

        }
      );


    // ========================================
    // EXPORT CSV
    // ========================================

    document
      .getElementById("leadsExport")
      .addEventListener(
        "click",
        function(){

          var csv =
            "Name,Email,File,Time\n" +

            savedLog
              .map(
                function(r){

                  return [
                    r.name,
                    r.email,
                    r.file,
                    r.time
                  ]
                  .map(
                    function(v){

                      return (
                        "\"" +
                        String(v)
                          .replace(
                            /"/g,
                            "\"\""
                          ) +
                        "\""
                      );

                    }
                  )
                  .join(",");

                }
              )
              .join("\n");


          var blob =
            new Blob(
              [csv],
              {
                type:
                  "text/csv"
              }
            );


          var url =
            URL.createObjectURL(
              blob
            );


          var a =
            document.createElement(
              "a"
            );


          a.href =
            url;

          a.download =
            "aquabas-signups.csv";


          document.body.appendChild(
            a
          );

          a.click();

          document.body.removeChild(
            a
          );


          setTimeout(
            function(){

              URL.revokeObjectURL(
                url
              );

            },
            10000
          );

        }
      );

  }

})();
