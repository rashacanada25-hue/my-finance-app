import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const selectRef = useRef();

  useEffect(() => {
    // שליפת נתונים מה-API
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setFiltered(data.products);
        const uniqueCats = [...new Set(data.products.map(p => p.category))];
        setCategories(uniqueCats);
      });

    // מיקוד אוטומטי
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, []);

  const handleFilter = (e) => {
    const value = e.target.value;
    if (value === "all") {
      setFiltered(products);
    } else {
      setFiltered(products.filter(p => p.category === value));
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>החנות הדיגיטלית שלי</h1>
        <div style={styles.filterContainer}>
          <label style={styles.label}>סנן לפי קטגוריה:</label>
          <select ref={selectRef} onChange={handleFilter} style={styles.select}>
            <option value="all">כל המוצרים</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </header>

      <main style={styles.grid}>
        {filtered.map(item => (
          <div key={item.id} style={styles.card}>
            <div style={styles.imageWrapper}>
              <img src={item.thumbnail} alt={item.title} style={styles.image} />
            </div>
            <div style={styles.info}>
              <h3 style={styles.productTitle}>{item.title}</h3>
              <p style={styles.categoryTag}>{item.category}</p>
              <div style={styles.footer}>
                <span style={styles.price}>${item.price}</span>
                <button style={styles.button}>הוסף לסל</button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

const styles = {
  container: { padding: '40px 20px', direction: 'rtl', fontFamily: 'Arial', backgroundColor: '#f4f7f6', minHeight: '100vh' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { color: '#2c3e50', fontSize: '2.5rem' },
  filterContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
  label: { fontSize: '18px', fontWeight: '600' },
  select: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' },
  card: { backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' },
  imageWrapper: { padding: '20px', textAlign: 'center' },
  image: { height: '150px', maxWidth: '100%', objectFit: 'contain' },
  info: { padding: '20px', flexGrow: 1 },
  productTitle: { fontSize: '18px', margin: '0 0 10px 0' },
  categoryTag: { fontSize: '12px', color: '#7f8c8d' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
  price: { fontSize: '20px', fontWeight: 'bold', color: '#27ae60' },
  button: { backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }
};

export default App;