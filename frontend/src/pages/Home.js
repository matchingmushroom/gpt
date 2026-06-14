import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderModal from '../components/OrderModal';

const API = 'http://localhost:5000/api';

const styles = {
  section: { padding: '60px 20px', maxWidth: 1100, margin: 'auto' },
  sectionTitle: { textAlign: 'center', fontSize: 30, marginBottom: 30, fontWeight: 700 },
  story: { textAlign: 'center', lineHeight: 1.8, color: '#555', maxWidth: 800, margin: 'auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 },
  card: { background: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
  productImg: { width: '100%', borderRadius: 12, aspectRatio: '1/1', objectFit: 'cover' },
  productTitle: { fontWeight: 600, marginTop: 12, fontSize: 18 },
  productDesc: { fontSize: 14, color: '#555', margin: '6px 0' },
  price: { fontWeight: 700, margin: '8px 0', color: '#E67E22', fontSize: 16 },
  btn: { background: '#E67E22', color: '#fff', padding: '10px 14px', borderRadius: 8, border: 'none', fontSize: 14, cursor: 'pointer', width: '100%' },
  testimonialsSection: { background: '#fff', padding: '60px 20px', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' },
  testimonialCard: { background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' },
  testimonialName: { fontWeight: 600, color: '#E67E22', marginTop: 10 },
  testimonialPickle: { fontSize: 14, color: '#555' },
};

const testimonials = [
  { text: 'The <b>Spicy Mango Achar</b> reminded me of my childhood in Terai! Perfect blend of tanginess and spice.', name: '— Sushma Thapa', pickle: 'Tried: Spicy Mango Achar' },
  { text: 'The <b>Big Buff Blast Achar</b> is just wow! Smoky, spicy, and so flavorful. Must-try for meat lovers.', name: '— Ramesh Karki', pickle: 'Tried: Big Buff Blast Achar' },
  { text: 'Loved the <b>Smoky Chicken Delight Achar</b>. The aroma and tenderness of chicken are unbeatable!', name: '— Priyanka Gurung', pickle: 'Tried: Smoky Chicken Delight Achar' },
  { text: 'Red Chili Crunch Achar adds a kick to every meal! GPT pickles truly have that homemade authenticity.', name: '— Deepak Maharjan', pickle: 'Tried: Red Chili Crunch' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API}/products`);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products');
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <header style={{ background: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#E67E22' }}>GPT — Great Pickle Taste</div>
        <div>
          <a href="/login" style={{ color: '#E67E22', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>Staff / Admin Login</a>
        </div>
      </header>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Story</h2>
        <p style={styles.story}>
          GPT (Great Pickle Taste) began in a home kitchen where a passionate housewife followed her dream of sharing her family's treasured recipes passed down from her mother and grandmother.
          Exploring diverse pickle styles from across Nepal, she built a brand that celebrates tradition, authenticity, and empowerment.
          Today, GPT brings these incredible homemade tastes to the world—crafted by an inspiring team of women bringing incredible taste to incredible people like you.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Pickles</h2>
        <div style={styles.grid}>
          {products.map(p => (
            <div key={p._id} style={styles.card}>
              <img style={styles.productImg} src={p.imageUrl || 'https://via.placeholder.com/300'} alt={p.name} />
              <div style={styles.productTitle}>{p.name}</div>
              <div style={styles.productDesc}>{p.description || p.flavour || ''}</div>
              <div style={styles.price}>Rs {p.price}</div>
              <button style={styles.btn} onClick={() => setSelectedProduct(p)}>Order Now</button>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.testimonialsSection}>
        <h2 style={styles.sectionTitle}>What Our Customers Say</h2>
        <div style={{ ...styles.grid, maxWidth: 1100, margin: 'auto' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={styles.testimonialCard}>
              <p dangerouslySetInnerHTML={{ __html: t.text }} />
              <div style={styles.testimonialName}>{t.name}</div>
              <div style={styles.testimonialPickle}>{t.pickle}</div>
            </div>
          ))}
        </div>
      </section>

      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <footer style={{ background: '#fff', padding: 30, textAlign: 'center', color: '#666', fontSize: 14, borderTop: '1px solid #eee' }}>
        &copy; 2025 GPT — Great Pickle Taste. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
