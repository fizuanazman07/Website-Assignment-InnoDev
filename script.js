// ========================================
// KONFIGURASI - URL SUDAH DIMASUKKAN
// ========================================

// >>> URL GOOGLE APPS SCRIPT ANDA <<<
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwCL53YD6c9jer2aGqFBYM4XS3nyQs0SRdaa-0H4NcYBEShQ7-Ik39Y6l6Rit0i6FJo4A/exec";

// >>> SET TRUE UNTUK GUNA DATA SEBENAR <<<
const USE_REAL_DATA = true;  // SUDAH SET TRUE

// >>> NILAI AWAL PESERTA (jika guna simulasi) <<<
const DEFAULT_PARTICIPANT_COUNT = 0;

// ========================================
// JANGAN UBAH KOD DI BAWAH
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== MOBILE NAVIGATION ==========
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        const allNavLinks = document.querySelectorAll('.nav-links li a');
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }
    
    // ========== COUNTDOWN TIMER ==========
    function startCountdown() {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (!daysEl) return;
        
        const targetDate = new Date(2026, 7, 15, 8, 0, 0);
        
        function updateCountdown() {
            const now = new Date();
            const diff = targetDate - now;
            
            if (diff <= 0) {
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            daysEl.textContent = days.toString().padStart(2, '0');
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    startCountdown();
    
    // ========== PARTICIPANT COUNTER (DENGAN URL ANDA) ==========
    const counterEl = document.getElementById('participantCounter');
    
    async function fetchRealParticipantCount() {
        if (!USE_REAL_DATA || !GOOGLE_APPS_SCRIPT_URL) {
            console.log('🔧 Mode Simulasi: Counter naik secara rawak');
            return null;
        }
        
        try {
            console.log('📡 Mengambil data dari:', GOOGLE_APPS_SCRIPT_URL);
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
            const data = await response.json();
            console.log('✅ Data diterima:', data);
            return data.count || data.participants || data.total || 0;
        } catch (error) {
            console.error('❌ Error fetching data:', error);
            return null;
        }
    }
    
    async function updateParticipantCounter() {
        if (!counterEl) return;
        
        // Try to get real data
        const realCount = await fetchRealParticipantCount();
        
        if (realCount !== null && USE_REAL_DATA) {
            // Guna data sebenar dari Google Apps Script
            counterEl.textContent = realCount;
            localStorage.setItem('participantCount', realCount);
            console.log(`📊 Counter real-time: ${realCount} peserta`);
        } else {
            // Guna mode simulasi (untuk demo)
            let count = localStorage.getItem('participantCount');
            if (!count || isNaN(parseInt(count))) {
                count = DEFAULT_PARTICIPANT_COUNT;
            } else {
                count = parseInt(count);
            }
            
            counterEl.textContent = count;
            
            // Simulasi naik setiap 20 saat (untuk demo sahaja)
            setInterval(() => {
                if (Math.random() < 0.3) {
                    count++;
                    counterEl.textContent = count;
                    localStorage.setItem('participantCount', count);
                    
                    // Animation effect
                    counterEl.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        counterEl.style.transform = 'scale(1)';
                    }, 200);
                    
                    console.log(`✨ Demo: Peserta baru! Jumlah: ${count}`);
                }
            }, 20000);
        }
    }
    
    updateParticipantCounter();
    
    // Manual refresh button (optional - tekan F5 atau klik counter)
    if (counterEl && USE_REAL_DATA) {
        counterEl.style.cursor = 'pointer';
        counterEl.addEventListener('click', () => {
            updateParticipantCounter();
            counterEl.style.transform = 'scale(1.05)';
            setTimeout(() => {
                counterEl.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    // ========== FOOTER YEAR ==========
    const footerYear = document.querySelector('.footer p:first-child');
    if (footerYear) {
        const year = new Date().getFullYear();
        footerYear.innerHTML = `&copy; ${year} Pertandingan Inovasi Digital InnoDev | UPSI`;
    }
    
    // ========== INFO DI CONSOLE ==========
    console.log('🚀 InnoDev Website Loaded!');
    if (USE_REAL_DATA && GOOGLE_APPS_SCRIPT_URL) {
        console.log('✅ Mode REAL: Counter akan baca dari Google Apps Script');
        console.log('🔗 URL:', GOOGLE_APPS_SCRIPT_URL);
    } else {
        console.log('🔧 Mode SIMULASI: Counter naik rawak untuk demo');
    }
});