// ====== קובץ: script.js (הגרסה הסופית והמתוקנת עם תמונות) ======

// מערך האובייקטים המייצגים מוצר, כולל נתיב תמונה (image)
const products = [
    { 
        name: "מחשב נייד 'דגל'", 
        description: "נייד חזק לעבודה ומשחקים", 
        price: 5500, 
        image: "https://picsum.photos/id/1/60/60" // תמונה רנדומלית
    },
    { 
        name: "מקלדת ארגונומית", 
        description: "מקלדת נוחה ליד", 
        price: 450, 
        image: "https://picsum.photos/id/20/60/60" // תמונה רנדומלית
    },
    { 
        name: "עכבר גיימינג אלחוטי", 
        description: "עכבר מהיר ודיוק מירבי", 
        price: 200, 
        image: "https://picsum.photos/id/30/60/60" // תמונה רנדומלית
    },
    { 
        name: "מסך רחב 34 אינץ'", 
        description: "מסך קעור באיכות 4K", 
        price: 3100, 
        image: "https://picsum.photos/id/40/60/60" // תמונה רנדומלית
    },
    { 
        name: "אוזניות אלחוטיות", 
        description: "סינון רעשים אקטיבי", 
        price: 1200, 
        image: "https://picsum.photos/id/50/60/60" // תמונה רנדומלית
    },
    { 
        name: "דיסק חיצוני 1TB", 
        description: "גיבוי מהיר ואמין", 
        price: 350, 
        image: "https://picsum.photos/id/60/60/60" // תמונה רנדומלית
    },
    { 
        name: "משטח לעכבר", 
        description: "משטח גיימינג גדול", 
        price: 80, 
        image: "https://picsum.photos/id/70/60/60" // תמונה רנדומלית
    }
];

// משיכת המיכל לתוצאות פעם אחת
const resultsContainer = document.getElementById('resultsContainer');

/**
 * פונקציה שמסננת ומציגה מוצרים לפי מחיר מקסימלי.
 * הפונקציה נקראת בכל פעם שהמשתמש מקליד (באמצעות oninput).
 * @param {string} maxPriceStr - המחיר המקסימלי (כטקסט) מהאינפוט.
 */
function displayFilteredProducts(maxPriceStr) {
    // 1. ניקוי תוצאות קודמות
    resultsContainer.innerHTML = '';

    // המרה למספר והבטחת שהקלט חוקי
    const maxPrice = parseFloat(maxPriceStr);
    
    if (isNaN(maxPrice) || maxPrice <= 0) {
        resultsContainer.innerHTML = '<p style="color: grey;">אנא הכנס מחיר חיובי כדי לסנן.</p>';
        return;
    }

    // 2. סינון המוצרים
    const filteredProducts = products.filter(product => {
        return product.price <= maxPrice;
    });

    // 3. הצגת התוצאות החדשות
    if (filteredProducts.length === 0) {
        resultsContainer.innerHTML = `<p style="color: red;">לא נמצאו מוצרים במחיר של עד ${maxPrice} ש"ח.</p>`;
        return;
    }

    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-ad'; 
        
        // יצירת מבנה HTML הכולל את תגית התמונה ואת הקלאסים שמעוצבים ב-CSS
        productDiv.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-details">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <p class="price">מחיר: ${product.price} ש"ח</p>
            </div>
        `;

        resultsContainer.appendChild(productDiv);
    });
}