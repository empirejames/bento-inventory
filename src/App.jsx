import React, { useState, useMemo } from 'react';
import { INGREDIENTS, BENTO_TYPES } from './data/recipes';
import './index.css';

function App() {
  const [sales, setSales] = useState({
    signature_chicken: 0
  });
  const [stock, setStock] = useState({});

  const handleStockSet = (id, value) => {
    const val = parseFloat(value);
    setStock(prev => ({
      ...prev,
      [id]: isNaN(val) ? 0 : Math.max(0, val)
    }));
  };

  const handleUpdate = (id, delta) => {
    setSales(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const handleSet = (id, value) => {
    const val = parseInt(value, 10);
    setSales(prev => ({
      ...prev,
      [id]: isNaN(val) ? 0 : Math.max(0, val)
    }));
  };

  const totals = useMemo(() => {
    const req = {};
    let totalCost = 0;

    // Initialize required amounts
    Object.keys(INGREDIENTS).forEach(key => {
      req[key] = {
        ...INGREDIENTS[key],
        amount: 0,
        cost: 0,
        prepAmount: 0
      };
    });

    // Calculate per bento
    BENTO_TYPES.forEach(bento => {
      const sold = sales[bento.id] || 0;
      if (sold > 0) {
        Object.entries(bento.ingredients).forEach(([ingKey, qty]) => {
          if (req[ingKey]) {
            req[ingKey].amount += sold * qty;
            req[ingKey].cost += sold * qty * req[ingKey].costPerUnit;
            totalCost += sold * qty * req[ingKey].costPerUnit;
          }
        });
      }
    });

    // Calculate prep and order amounts
    Object.values(req).forEach(item => {
      if (item.amount > 0) {
        // Calculate Prep
        if (item.prepStrategy === 'ceil') {
          item.prepAmount = Math.ceil(item.amount);
        } else if (item.prepStrategy === 'half') {
          item.prepAmount = Math.ceil(item.amount * 2) / 2;
        } else {
          item.prepAmount = item.amount;
        }

        // Calculate Order
        const currentStock = stock[item.id] || 0;
        const rawOrder = Math.max(0, item.amount - currentStock);
        if (item.prepStrategy === 'ceil') {
          item.orderAmount = Math.ceil(rawOrder);
        } else if (item.prepStrategy === 'half') {
          item.orderAmount = Math.ceil(rawOrder * 2) / 2;
        } else {
          item.orderAmount = Number(rawOrder.toFixed(2));
        }
      }
    });

    return { req, totalCost };
  }, [sales]);

  return (
    <div className="container">
      <div className="card">
        <h2>便當銷售輸入</h2>
        {BENTO_TYPES.map(bento => (
          <div key={bento.id} className="input-group">
            <div>
              <div className="summary-name">{bento.name}</div>
              <div className="text-sm" style={{color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                預估單份食材成本: ~52元
              </div>
            </div>
            <div className="input-controls">
              <button onClick={() => handleUpdate(bento.id, -1)}>-</button>
              <input 
                type="number" 
                value={sales[bento.id] || ''} 
                onChange={(e) => handleSet(bento.id, e.target.value)} 
                placeholder="0"
              />
              <button onClick={() => handleUpdate(bento.id, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>所需原物料總計</h2>
        <ul className="summary-list">
          {Object.values(totals.req).filter(item => item.amount > 0).map(item => (
            <li key={item.id} className="summary-item">
              <div>
                <span className="summary-name">{item.name}</span>
                <span className="badge">{item.unit}</span>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div className="summary-val" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  預估消耗: {item.amount % 1 !== 0 ? item.amount.toFixed(2) : item.amount} {item.unit}
                </div>
                {item.prepStrategy && item.prepStrategy !== 'none' && (
                  <div style={{ color: 'var(--accent-color)', fontSize: '0.95rem', marginTop: '0.2rem', fontWeight: 600 }}>
                    建議備料: {item.prepAmount} {item.unit}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.8rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>盤點剩下:</span>
                  <input 
                    type="number" 
                    step="0.1"
                    value={stock[item.id] || ''}
                    onChange={(e) => handleStockSet(item.id, e.target.value)}
                    placeholder="0"
                    style={{ width: '60px', padding: '0.3rem', fontSize: '0.9rem', textAlign: 'center' }}
                  />
                </div>
                <div style={{ color: '#fbbf24', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 700, padding: '0.3rem 0.6rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '6px' }}>
                  🛒 實際叫貨: {item.orderAmount} {item.unit}
                </div>
              </div>
            </li>
          ))}
          {Object.values(totals.req).filter(item => item.amount > 0).length === 0 && (
            <div style={{color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0'}}>
              請在左側輸入便當數量
            </div>
          )}
        </ul>
        
        {totals.totalCost > 0 && (
          <div className="total-cost">
            <span>預估總成本</span>
            <span>NT$ {Math.round(totals.totalCost).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
