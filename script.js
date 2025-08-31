/* ======= KODE ASLI (TIDAK DIUBAH FUNGSI/LOGIKA) ======= */
var button = document.getElementById("enter");
var input = document.getElementById("userinput");
var ul = document.querySelector("ul");

function inputLength() {
  return input.value.trim().length;
}

function addDeleteButton(li) {
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Hapus";                // tetap default ID
  deleteBtn.classList.add("delete-btn");
  li.appendChild(deleteBtn);
}

function createListElement() {
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(input.value + " "));
  addDeleteButton(li);
  ul.appendChild(li);
  input.value = "";
}

function addList() {
  if (inputLength() > 0) {
    createListElement();
    // animasi halus (tanpa mengubah fungsi)
    const last = ul.lastElementChild;
    last.style.transition = "transform 160ms ease, box-shadow 200ms ease";
    last.style.transform = "translateY(-2px)";
    setTimeout(() => { last.style.transform = "translateY(0)"; }, 160);
  }
}

function listControl(e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("done");

    // kalau sudah dicoret, disable tombol hapus
    const btn = e.target.querySelector(".delete-btn");
    if (btn) {
      if (e.target.classList.contains("done")) {
        btn.disabled = true;
        btn.classList.add("disabled");
      } else {
        btn.disabled = false;
        btn.classList.remove("disabled");
      }
    }

  } else if (e.target.classList.contains("delete-btn")) {
    // hanya boleh hapus kalau belum done
    if (!e.target.parentElement.classList.contains("done")) {
      e.target.parentElement.remove();
    }
  }
}

button.addEventListener("click", addList);

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    addList();
  }
});

ul.addEventListener("click", listControl);

// Tambahkan delete button ke item yang sudah ada sebelumnya
const existingItems = ul.querySelectorAll("li");
existingItems.forEach(li => addDeleteButton(li));


/* ======= ENHANCEMENT: DARK MODE + TOGGLE BAHASA ======= */
/* — Tanpa menyentuh fungsi asli di atas — */

const darkToggle = document.getElementById("darkToggle");
const langToggle = document.getElementById("langToggle");
const titleEl = document.getElementById("title");
const checkTextEl = document.getElementById("checkText");

const translations = {
  id: {
    title: "Daftar Belanja",
    placeholder: "Nama barang...",
    add: "Tambahkan",
    checklist: "Cek Daftar Barang:",
    delete: "Hapus",
    langBtn: "EN"
  },
  en: {
    title: "Shopping List",
    placeholder: "Item name...",
    add: "Add",
    checklist: "Check Your Items:",
    delete: "Delete",
    langBtn: "ID"
  }
};

let currentLang = localStorage.getItem("lang") || "id";
let isDark = localStorage.getItem("dark") === "1";

function applyLanguage() {
  const t = translations[currentLang];
  if (titleEl) titleEl.textContent = t.title;
  if (input) input.placeholder = t.placeholder;
  if (button) button.textContent = t.add;
  if (checkTextEl) checkTextEl.textContent = t.checklist;
  if (langToggle) langToggle.textContent = t.langBtn;
  // update semua label tombol hapus yang ada
  document.querySelectorAll(".delete-btn").forEach(btn => btn.textContent = t.delete);
}

function applyDarkMode() {
  document.body.classList.toggle("theme-dark", isDark);
  if (darkToggle) darkToggle.textContent = isDark ? "☀️" : "🌙";
}

if (langToggle) {
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "id" ? "en" : "id";
    localStorage.setItem("lang", currentLang);
    applyLanguage();
  });
}

if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    isDark = !isDark;
    localStorage.setItem("dark", isDark ? "1" : "0");
    applyDarkMode();
  });
}

// Terapkan preferensi saat load
applyDarkMode();
applyLanguage();

// Pastikan item baru mengikuti bahasa aktif (tanpa ubah fungsi asli):
// Kita “pantau” setiap kali <li> baru ditambahkan, lalu set label hapus-nya.
const mo = new MutationObserver((mutList) => {
  const t = translations[currentLang];
  mutList.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.nodeName === "LI") {
        const btn = node.querySelector(".delete-btn");
        if (btn) btn.textContent = t.delete;
      }
    });
  });
});
mo.observe(ul, { childList: true });


/* ======= FITUR BARU: Checkout, Save PNG, Clear All (dengan perbaikan share) ======= */
/* Catatan: semua listener yang berhubungan dengan elemen yang mungkin tidak ada
   dipasang hanya jika elemen tersebut ditemukan — mencegah error runtime. */

const checkoutBtn = document.getElementById("checkoutBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");

/* Modal lama (opsional) */
const modal = document.getElementById("checkoutModal");
const checkoutList = document.getElementById("checkoutList");
const closeModal = document.getElementById("closeModal");
const shareBtn = document.getElementById("shareBtn");

/* Popup baru (opsional) */
const checkoutPopup = document.getElementById("checkoutPopup");
const closePopup = document.getElementById("closePopup");
const shareImageBtn = document.getElementById("shareImageBtn");
const shareTextBtn = document.getElementById("shareTextBtn");

/* === Helper: ambil teks daftar === */
function getListPlainItems() {
  // menghapus teks tombol "Hapus"/"Delete" dari konten li
  return [...ul.querySelectorAll("li")].map(li => li.textContent.replace("Hapus","").replace("Delete","").trim());
}

/* === Unified Checkout opener:
   - Jika ada popup -> buka popup
   - else jika ada modal -> isi modal + buka modal
   Ini mencegah pemasangan 2 listener sendiri pada checkoutBtn */
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (checkoutPopup) {
      // buka popup baru
      checkoutPopup.classList.remove("hidden");
      return;
    }
    if (modal) {
      // isi dan buka modal lama
      const items = getListPlainItems();
      if (checkoutList) checkoutList.innerHTML = "<ul>" + items.map(i => `<li>${i}</li>`).join("") + "</ul>";
      modal.classList.remove("hidden");
    }
  });
}

/* === Close handlers (jika ada) === */
if (closePopup) {
  closePopup.addEventListener("click", () => {
    checkoutPopup.classList.add("hidden");
  });
}
if (closeModal) {
  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

/* === Share handler untuk modal lama (jika masih ada) ===
   - tetap share teks (fallback copy) */
if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const items = getListPlainItems().join("\n");
    if (navigator.share) {
      try {
        await navigator.share({ title: "Daftar Belanja", text: items });
      } catch (err) {
        alert("Gagal share: " + err);
      }
    } else {
      // fallback copy to clipboard
      try {
        await navigator.clipboard.writeText(items);
        alert("Daftar belanja disalin ke clipboard!");
      } catch (e) {
        alert("Tidak bisa menyalin ke clipboard.");
      }
    }
  });
}

/* === Save PNG (jika tombol ada) === */
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    const daftarEl = document.getElementById("daftar") || document.body;
    html2canvas(daftarEl).then(canvas => {
      const link = document.createElement("a");
      link.download = "daftar-belanja.png";
      link.href = canvas.toDataURL();
      link.click();
    }).catch(err => {
      console.error("html2canvas error:", err);
      alert("Gagal menyimpan gambar.");
    });
  });
}

/* === Clear All (jika tombol ada) === */
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (confirm("Yakin hapus semua daftar?")) {
      ul.innerHTML = "";
    }
  });
}

/* === captureListAsBlob: promise-based helper === */
function captureListAsBlob() {
  const daftarEl = document.getElementById("daftar") || document.body;
  return html2canvas(daftarEl).then(canvas => {
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  });
}

/* === Popup: Share as Image (jika tombol ada) === */
if (shareImageBtn) {
  shareImageBtn.addEventListener("click", async () => {
    try {
      const blob = await captureListAsBlob();
      if (!blob) throw new Error("Gagal membuat blob gambar.");

      const file = new File([blob], "daftar-belanja.png", { type: "image/png" });

      // Jika browser mendukung share file
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Daftar Belanja",
            text: "Ini daftar belanja saya 🚀",
          });
        } catch (err) {
          console.log("Gagal share gambar via Web Share API:", err);
          alert("Gagal share gambar: " + (err && err.message ? err.message : err));
        }
      } else {
        // fallback: unduh gambar
        const link = document.createElement("a");
        link.download = "daftar-belanja.png";
        link.href = URL.createObjectURL(blob);
        link.click();
        alert("Browser tidak mendukung share gambar. Daftar diunduh sebagai PNG.");
      }
    } catch (err) {
      console.error("shareImage error:", err);
      alert("Gagal membuat atau membagikan gambar.");
    } finally {
      if (checkoutPopup) checkoutPopup.classList.add("hidden");
      if (modal) modal.classList.add("hidden");
    }
  });
}

/* === Popup: Share as Text (jika tombol ada) === */
if (shareTextBtn) {
  shareTextBtn.addEventListener("click", async () => {
    const items = getListPlainItems();
    const text = "🛒 Daftar Belanja:\n" + items.map((it, i) => `${i+1}. ${it}`).join("\n");

    if (navigator.share) {
      try {
        await navigator.share({ title: "Daftar Belanja", text });
      } catch (err) {
        console.log("Gagal share teks:", err);
        alert("Gagal share teks: " + (err && err.message ? err.message : err));
      }
    } else {
      // fallback copy ke clipboard
      try {
        await navigator.clipboard.writeText(text);
        alert("Daftar belanja disalin ke clipboard ✅ tinggal tempel di WhatsApp/Telegram!");
      } catch (err) {
        console.error("Clipboard write failed:", err);
        alert("Tidak bisa menyalin ke clipboard.");
      }
    }

    if (checkoutPopup) checkoutPopup.classList.add("hidden");
    if (modal) modal.classList.add("hidden");
  });
}

/* === Safety note: jika developer ingin hanya menggunakan popup baru,
   hapus elemen modal lama dari HTML agar UI lebih bersih. === */