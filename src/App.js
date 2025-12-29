import { useState, useEffect } from 'react';
import { Clock, ShoppingCart, PiggyBank, Calendar, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function WorkHoursCalculator() {
  const [wageType, setWageType] = useState('hourly');
  const [hourlyWage, setHourlyWage] = useState('');
  const [annualSalary, setAnnualSalary] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [taxRate, setTaxRate] = useState('25');
  const [itemCost, setItemCost] = useState('');
  const [itemName, setItemName] = useState('');
  const [decision, setDecision] = useState(null);
  const [interestRate, setInterestRate] = useState('7');
  const [years, setYears] = useState('10');
  const [savedItems, setSavedItems] = useState([]);
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [adMobReady, setAdMobReady] = useState(false);
  const [isAdFree, setIsAdFree] = useState(false);
  const [adFreeUntil, setAdFreeUntil] = useState(null);
  const [showAdLimitModal, setShowAdLimitModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [currentTip, setCurrentTip] = useState(null);
  const FREE_SAVE_LIMIT = 5;

  const moneyHacks = [
    {
      icon: '💰',
      title: 'Earn 100x More on Your Savings',
      description: 'Traditional banks pay 0.01% interest. High-yield savings accounts pay 4-5% APY. On $10,000, that\'s $450/year vs $1/year. Move your emergency fund today.',
      buttons: [
        { text: 'Open Ally Account', link: 'https://www.ally.com/referral?code=4V2D7M4H7W&CP=WebAppReferFriend' },
        { text: 'Try Marcus', link: 'https://www.marcus.com/share/JEN-N3T-84D9' }
      ]
    },
    {
      icon: '🛒',
      title: 'Get Paid to Buy Groceries',
      description: 'Scan your grocery receipts and earn cashback on items you already buy. Most people earn $10-30/month just from normal shopping. Stack with store sales for maximum savings.',
      buttons: [
        { text: 'Get $5 Bonus - Ibotta', link: 'https://ibotta.onelink.me/iUfE/8cc13c64?friend_code=diqpaau' },
        { text: 'Get 2,000 Points - Fetch', link: 'https://referral.fetch.com/vvv3/referralemail?code=XDETVT' }
      ]
    },
    {
      icon: '✈️',
      title: 'Earn Free Travel Every Year',
      description: 'Get a $300 annual travel credit, airport lounge access, Global Entry credit, and earn points on every purchase. Turn your everyday spending into free flights and hotels. Pay it off monthly to avoid interest.',
      buttons: [
        { text: 'Get Capital One Venture', link: 'https://i.capitalone.com/JlBqBqa3d' }
      ]
    },
    {
      icon: '🤖',
      title: 'Set It and Forget It',
      description: 'People who automate savings save 2-3x more than those who do it manually. Set up automatic transfers to a high-yield savings account right after payday. You won\'t miss what you don\'t see.',
      buttons: [
        { text: 'Open HYSA', link: 'https://www.ally.com/referral?code=4V2D7M4H7W&CP=WebAppReferFriend' }
      ]
    },
    {
      icon: '💵',
      title: 'Reverse Your Money Flow',
      description: 'Most people save what\'s left after spending. Flip it: redirect a portion of your paycheck directly to a high-yield savings account first, then spend what\'s left. Even $50/paycheck = $1,300/year + compound interest at 4-5% APY.',
      buttons: [
        { text: 'Set Up Auto-Save with Ally', link: 'https://www.ally.com/referral?code=4V2D7M4H7W&CP=WebAppReferFriend' }
      ]
    },
    {
      icon: '⏰',
      title: 'Wait Before You Buy',
      description: 'For any purchase over $50, wait 24 hours before buying. For purchases over $500, wait a week. Studies show 70% of impulse purchases are regretted. This simple pause saves thousands annually.',
      buttons: []
    },
    {
      icon: '🧮',
      title: 'Calculate the Real Cost',
      description: '$200 shoes worn 100 times = $2/wear. $50 shoes worn 10 times = $5/wear. The cheaper item is actually more expensive. Quality over quantity wins.',
      buttons: []
    },
    {
      icon: '📊',
      title: 'The Simplest Budget That Works',
      description: 'Allocate 50% to needs (rent, food, utilities), 30% to wants (entertainment, dining out), and 20% to savings and debt. Adjust percentages to your situation, but track these three categories ruthlessly.',
      buttons: []
    },
    {
      icon: '💬',
      title: 'One Question Saves Hundreds',
      description: '\'Is that your best price?\' or \'Can you do better?\' works on insurance, cable, furniture, medical bills, and more. Companies have retention budgets. Average savings: $300-500/year for 10 minutes of asking.',
      buttons: []
    },
    {
      icon: '🍱',
      title: 'Cook Once, Eat All Week',
      description: 'Eating out costs $15-20/meal. Home cooking costs $3-5/meal. Meal prep one day a week saves $200-400/month. That\'s $2,400-4,800/year - enough for a vacation or emergency fund.',
      buttons: []
    },
    {
      icon: '☕',
      title: 'Don\'t Blame the Coffee',
      description: 'Cutting daily $5 coffee saves $1,825/year - but misses the point. Focus on the big three: housing (aim for <30% income), transportation, and food. A $1,000/month car payment costs more than 20 years of lattes.',
      buttons: []
    },
    {
      icon: '📝',
      title: 'Awareness Creates Change',
      description: 'Track every dollar for 30 days. No judgment, just data. Most people find $200-500/month in \'invisible\' spending (subscriptions, convenience purchases). You can\'t fix what you don\'t measure.',
      buttons: []
    },
    {
      icon: '✉️',
      title: 'Give Every Dollar a Job',
      description: 'Create separate savings accounts for different goals: emergency fund, vacation, car replacement, etc. Seeing $500 in \'vacation fund\' feels different than $500 in \'savings\'. Psychological trick that works.',
      buttons: []
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EBF4FF 0%, #C3DAFE 100%)',
      padding: '24px',
      paddingBottom: '96px'
    },
    card: {
      maxWidth: '672px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      padding: '32px',
      marginBottom: '24px'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.3s'
    },
    buttonPrimary: {
      background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      color: 'white'
    },
    buttonSuccess: {
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      color: 'white'
    },
    buttonEmerald: {
      background: 'linear-gradient(135deg, #34D399 0%, #14B8A6 100%)',
      color: 'white'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    resultCard: {
      background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      borderRadius: '16px',
      padding: '24px',
      color: 'white',
      marginBottom: '24px'
    }
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('savedItems') || '[]');
    setSavedItems(stored);
    
    const adFreeTime = localStorage.getItem('adFreeUntil');
    if (adFreeTime && new Date(adFreeTime) > new Date()) {
      setIsAdFree(true);
      setAdFreeUntil(adFreeTime);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (adFreeUntil && new Date(adFreeUntil) <= new Date()) {
        setIsAdFree(false);
        setAdFreeUntil(null);
        localStorage.removeItem('adFreeUntil');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [adFreeUntil]);

  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    const initializeAdMob = async () => {
      try {
        if (window.Capacitor) {
          const { AdMob } = await import('@capacitor-community/admob');
          
          await AdMob.initialize({
            requestTrackingAuthorization: true,
            initializeForTesting: false,
          });

          if (!isAdFree) {
            await AdMob.showBanner({
              adId: 'ca-app-pub-6765400289717080/4799268247',
              adSize: 'BANNER',
              position: 'BOTTOM_CENTER',
              margin: 0,
            });
          }

          setAdMobReady(true);
        }
      } catch (error) {
        console.log('AdMob initialization failed:', error);
      }
    };

    initializeAdMob();

    return () => {
      if (window.Capacitor && adMobReady && !isAdFree) {
        import('@capacitor-community/admob').then(({ AdMob }) => {
          AdMob.hideBanner().catch(() => {});
        });
      }
    };
  }, [isAdFree, adMobReady]);
  
  const calculateHours = () => {
    let hourlyRate;
    
    if (wageType === 'hourly') {
      hourlyRate = parseFloat(hourlyWage);
    } else if (wageType === 'monthly') {
      const monthly = parseFloat(monthlySalary);
      const weeklyHours = parseFloat(hoursPerWeek);
      hourlyRate = (monthly * 12) / (52 * weeklyHours);
    } else {
      const salary = parseFloat(annualSalary);
      const weeklyHours = parseFloat(hoursPerWeek);
      hourlyRate = salary / (52 * weeklyHours);
    }
    
    const tax = parseFloat(taxRate) / 100;
    const afterTaxHourly = hourlyRate * (1 - tax);
    const cost = parseFloat(itemCost);
    
    return cost / afterTaxHourly;
  };

  const calculateFutureValue = () => {
    const principal = parseFloat(itemCost);
    const rate = parseFloat(interestRate) / 100;
    const time = parseFloat(years);
    
    const futureValue = principal * Math.pow(1 + rate, time);
    const gain = futureValue - principal;
    
    return { futureValue, gain };
  };
  
  const isValid = () => {
    if (!itemCost || !taxRate) return false;
    if (wageType === 'hourly') {
      return hourlyWage && parseFloat(hourlyWage) > 0;
    } else if (wageType === 'monthly') {
      return monthlySalary && hoursPerWeek && 
             parseFloat(monthlySalary) > 0 && 
             parseFloat(hoursPerWeek) > 0;
    } else {
      return annualSalary && hoursPerWeek && 
             parseFloat(annualSalary) > 0 && 
             parseFloat(hoursPerWeek) > 0;
    }
  };

  const resetCalculator = () => {
    setWageType('hourly');
    setHourlyWage('');
    setAnnualSalary('');
    setMonthlySalary('');
    setHoursPerWeek('40');
    setTaxRate('25');
    setItemCost('');
    setItemName('');
    setDecision(null);
    setInterestRate('7');
    setYears('10');
  };

  const saveInvestmentDecision = () => {
    if (!isValid() || decision !== 'invest') return;

    if (savedItems.length >= FREE_SAVE_LIMIT) {
      setShowAdLimitModal(true);
      return;
    }

    const { futureValue, gain } = calculateFutureValue();
    const newItem = {
      id: Date.now(),
      name: itemName || 'Unnamed Item',
      amount: parseFloat(itemCost),
      date: new Date().toISOString(),
      hours: calculateHours(),
      interestRate: parseFloat(interestRate),
      years: parseFloat(years),
      futureValue,
      gain
    };

    setSavedItems([newItem, ...savedItems]);
    
    setItemName('');
    setItemCost('');
    setDecision(null);
  };

  const watchAdToSave = async () => {
    try {
      if (window.Capacitor) {
        const { AdMob } = await import('@capacitor-community/admob');
        
        await AdMob.prepareRewardVideoAd({
          adId: 'ca-app-pub-6765400289717080/5142049020',
        });

        const result = await AdMob.showRewardVideoAd();
        
        if (result) {
          setShowAdLimitModal(false);
          
          const { futureValue, gain } = calculateFutureValue();
          const newItem = {
            id: Date.now(),
            name: itemName || 'Unnamed Item',
            amount: parseFloat(itemCost),
            date: new Date().toISOString(),
            hours: calculateHours(),
            interestRate: parseFloat(interestRate),
            years: parseFloat(years),
            futureValue,
            gain
          };

          setSavedItems([newItem, ...savedItems]);
          
          setItemName('');
          setItemCost('');
          setDecision(null);
        }
      } else {
        setShowAdLimitModal(false);
        
        const { futureValue, gain } = calculateFutureValue();
        const newItem = {
          id: Date.now(),
          name: itemName || 'Unnamed Item',
          amount: parseFloat(itemCost),
          date: new Date().toISOString(),
          hours: calculateHours(),
          interestRate: parseFloat(interestRate),
          years: parseFloat(years),
          futureValue,
          gain
        };

        setSavedItems([newItem, ...savedItems]);
        
        setItemName('');
        setItemCost('');
        setDecision(null);
      }
    } catch (error) {
      console.log('Rewarded ad failed:', error);
      alert('Ad failed to load. Please try again.');
    }
  };

  const watchAdForAdFree = async () => {
    try {
      if (window.Capacitor) {
        const { AdMob } = await import('@capacitor-community/admob');
        
        await AdMob.prepareRewardVideoAd({
          adId: 'ca-app-pub-6765400289717080/8604173549',
        });

        const result = await AdMob.showRewardVideoAd();
        
        if (result) {
          const adFreeTime = new Date();
          adFreeTime.setHours(adFreeTime.getHours() + 24);
          setIsAdFree(true);
          setAdFreeUntil(adFreeTime.toISOString());
          localStorage.setItem('adFreeUntil', adFreeTime.toISOString());
          
          await AdMob.hideBanner().catch(() => {});
          
          alert('🎉 Ads removed for 24 hours!');
        }
      } else {
        const adFreeTime = new Date();
        adFreeTime.setHours(adFreeTime.getHours() + 24);
        setIsAdFree(true);
        setAdFreeUntil(adFreeTime.toISOString());
        localStorage.setItem('adFreeUntil', adFreeTime.toISOString());
        alert('🎉 Ads removed for 24 hours!');
      }
    } catch (error) {
      console.log('Rewarded ad failed:', error);
      alert('Ad failed to load. Please try again.');
    }
  };

  const showMoneyHack = async () => {
    try {
      if (window.Capacitor) {
        const { AdMob } = await import('@capacitor-community/admob');
        
        await AdMob.prepareRewardVideoAd({
          adId: 'ca-app-pub-6765400289717080/5142049020',
        });

        const result = await AdMob.showRewardVideoAd();
        
        if (result) {
          const randomIndex = Math.floor(Math.random() * moneyHacks.length);
          setCurrentTip(moneyHacks[randomIndex]);
          setShowTipModal(true);
        }
      } else {
        const randomIndex = Math.floor(Math.random() * moneyHacks.length);
        setCurrentTip(moneyHacks[randomIndex]);
        setShowTipModal(true);
      }
    } catch (error) {
      console.log('Rewarded ad failed:', error);
      alert('Ad failed to load. Please try again.');
    }
  };

  const deleteItem = (id) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  const groupByMonth = () => {
    const groups = {};
    savedItems.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      if (!groups[monthKey]) {
        groups[monthKey] = {
          name: monthName,
          items: [],
          total: 0,
          totalFutureValue: 0
        };
      }
      
      groups[monthKey].items.push(item);
      groups[monthKey].total += item.amount;
      groups[monthKey].totalFutureValue += item.futureValue;
    });
    
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  };

  const getTotalSavings = () => {
    return savedItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalFutureValue = () => {
    return savedItems.reduce((sum, item) => sum + item.futureValue, 0);
  };

  const hours = isValid() ? calculateHours() : 0;
  const hoursPerDay = (parseFloat(hoursPerWeek) || 40) / 5;
  const days = hours / hoursPerDay;
  const weeks = hours / (parseFloat(hoursPerWeek) || 40);

  const { futureValue, gain } = decision === 'invest' && isValid() ? calculateFutureValue() : { futureValue: 0, gain: 0 };
  const monthlyGroups = groupByMonth();

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '672px', margin: '0 auto' }}>
        {!isAdFree && (
          <button
            onClick={watchAdForAdFree}
            style={{
              ...styles.button,
              background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
              color: 'white',
              width: '100%',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>🎬</span>
            Watch 1 Ad to Remove Ads for 24 Hours
          </button>
        )}

        <div style={styles.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Clock style={{ width: '32px', height: '32px', color: '#667EEA' }} />
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>Work Hours Calculator</h1>
          </div>
          
          <p style={{ color: '#6B7280', marginBottom: '32px' }}>
            Find out how many hours you need to work to afford something
          </p>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
              I'm paid by:
            </label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setWageType('hourly')}
                style={{
                  flex: '1 1 calc(33.33% - 8px)',
                  minWidth: '100px',
                  ...styles.button,
                  ...(wageType === 'hourly' ? styles.buttonPrimary : { backgroundColor: '#F3F4F6', color: '#374151' })
                }}
              >
                Hourly
              </button>
              <button
                onClick={() => setWageType('monthly')}
                style={{
                  flex: '1 1 calc(33.33% - 8px)',
                  minWidth: '100px',
                  ...styles.button,
                  ...(wageType === 'monthly' ? styles.buttonPrimary : { backgroundColor: '#F3F4F6', color: '#374151' })
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setWageType('salary')}
                style={{
                  flex: '1 1 calc(33.33% - 8px)',
                  minWidth: '100px',
                  ...styles.button,
                  ...(wageType === 'salary' ? styles.buttonPrimary : { backgroundColor: '#F3F4F6', color: '#374151' })
                }}
              >
                Annual
              </button>
            </div>
          </div>

          {wageType === 'hourly' ? (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Hourly Wage
              </label>
              <input
                type="number"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(e.target.value)}
                placeholder="25.00"
                style={styles.input}
              />
            </div>
          ) : wageType === 'monthly' ? (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Monthly Salary
                </label>
                <input
                  type="number"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                  placeholder="4333"
                  style={styles.input}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Hours per Week
                </label>
                <input
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  placeholder="40"
                  style={styles.input}
                />
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Annual Salary
                </label>
                <input
                  type="number"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(e.target.value)}
                  placeholder="52000"
                  style={styles.input}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Hours per Week
                </label>
                <input
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  placeholder="40"
                  style={styles.input}
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Tax Rate (%)
            </label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              placeholder="25"
              style={styles.input}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Item Cost
            </label>
            <input
              type="number"
              value={itemCost}
              onChange={(e) => setItemCost(e.target.value)}
              placeholder="500.00"
              style={styles.input}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Item Name (Optional)
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., New Phone, Coffee"
              style={styles.input}
            />
          </div>

          {isValid() && (
            <>
              <div style={styles.resultCard}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Time to Afford This Item:</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ opacity: 0.9 }}>Hours:</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{hours.toFixed(1)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ opacity: 0.9 }}>Work Days:</span>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>{days.toFixed(1)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ opacity: 0.9 }}>Work Weeks:</span>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>{weeks.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={resetCalculator}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    ...styles.button,
                    backgroundColor: 'white',
                    color: '#667EEA'
                  }}
                >
                  Calculate Again
                </button>
              </div>

              <button
                onClick={showMoneyHack}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  marginBottom: '16px',
                  ...styles.button,
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>💡</span>
                Money Hack of the Day
              </button>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                  What will you do?
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    onClick={() => setDecision('buy')}
                    style={{
                      flex: 1,
                      ...styles.button,
                      ...(decision === 'buy' ? styles.buttonSuccess : { backgroundColor: '#F3F4F6', color: '#374151' }),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <ShoppingCart style={{ width: '20px', height: '20px' }} />
                    Buy It
                  </button>
                  <button
                    onClick={() => setDecision('invest')}
                    style={{
                      flex: 1,
                      ...styles.button,
                      ...(decision === 'invest' ? styles.buttonEmerald : { backgroundColor: '#F3F4F6', color: '#374151' }),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <PiggyBank style={{ width: '20px', height: '20px' }} />
                    Save & Invest
                  </button>
                </div>
              </div>

              {decision === 'buy' && (
                <div style={{ backgroundColor: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#166534', marginBottom: '12px' }}>
                    🛍️ Purchase Decision
                  </h3>
                  <p style={{ color: '#15803D', lineHeight: '1.6' }}>
                    You'll need to work <strong>{hours.toFixed(1)} hours</strong> ({days.toFixed(1)} work days) to afford this ${parseFloat(itemCost).toFixed(2)} purchase.
                  </p>
                  
                  <div style={{ marginTop: '24px', backgroundColor: '#EFF6FF', border: '2px solid #BFDBFE', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E40AF', marginBottom: '12px' }}>
                      💰 Get Cash Back
                    </h3>
                    <p style={{ color: '#1E3A8A', marginBottom: '16px' }}>
                      Get money back! Scan your receipts and earn cashback.
                    </p>
                    <a
                      href="https://ibotta.onelink.me/iUfE/8cc13c64?friend_code=diqpaau"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        backgroundColor: '#DBEAFE',
                        border: '1px solid #93C5FD',
                        borderRadius: '8px',
                        padding: '16px',
                        textDecoration: 'none',
                        marginBottom: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontWeight: 'bold', color: '#1F2937', margin: '0 0 4px 0' }}>Ibotta - Scan & Earn</p>
                          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Get $5 cashback bonus</p>
                        </div>
                        <span style={{ color: '#2563EB', fontWeight: 'bold' }}>Start →</span>
                      </div>
                    </a>
                    <a
                      href="https://referral.fetch.com/vvv3/referralemail?code=XDETVT"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        backgroundColor: '#DBEAFE',
                        border: '1px solid #93C5FD',
                        borderRadius: '8px',
                        padding: '16px',
                        textDecoration: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontWeight: 'bold', color: '#1F2937', margin: '0 0 4px 0' }}>Fetch Rewards</p>
                          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Get 2,000 points worth $2</p>
                        </div>
                        <span style={{ color: '#2563EB', fontWeight: 'bold' }}>Claim →</span>
                      </div>
                    </a>
                  </div>
                </div>
              )}

              {decision === 'invest' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                        Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="7"
                        step="0.1"
                        style={styles.input}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                        Years
                      </label>
                      <input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        placeholder="10"
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #34D399 0%, #14B8A6 100%)',
                    borderRadius: '16px',
                    padding: '24px',
                    color: 'white',
                    marginBottom: '24px'
                  }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                      📈 Investment Growth
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.9 }}>Initial Amount:</span>
                        <span style={{ fontSize: '20px', fontWeight: '600' }}>${parseFloat(itemCost).toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.9 }}>Future Value ({years} years):</span>
                        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>${futureValue.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '12px' }}>
                        <span style={{ opacity: 0.9 }}>Total Gain:</span>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#FDE047' }}>+${gain.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={saveInvestmentDecision}
                    style={{
                      width: '100%',
                      ...styles.button,
                      ...styles.buttonEmerald,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '24px'
                    }}
                  >
                    <PiggyBank style={{ width: '20px', height: '20px' }} />
                    Save This Decision
                  </button>

                  <div style={{ backgroundColor: '#ECFDF5', border: '2px solid #A7F3D0', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                    <p style={{ color: '#047857', lineHeight: '1.6' }}>
                      <strong>Smart choice!</strong> Your ${parseFloat(itemCost).toFixed(2)} could grow to ${futureValue.toFixed(2)} in {years} years!
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'white', border: '2px solid #6EE7B7', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>
                      💰 Where to Invest
                    </h3>
                    <a
                      href="https://www.ally.com/referral?code=4V2D7M4H7W&CP=WebAppReferFriend"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        backgroundColor: '#D1FAE5',
                        border: '1px solid #6EE7B7',
                        borderRadius: '8px',
                        padding: '16px',
                        textDecoration: 'none',
                        marginBottom: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontWeight: 'bold', color: '#1F2937', margin: '0 0 4px 0' }}>Ally Bank HYSA</p>
                          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Earn $100 bonus</p>
                        </div>
                        <span style={{ color: '#059669', fontWeight: 'bold' }}>Open →</span>
                      </div>
                    </a>
                    <a
                      href="https://www.marcus.com/share/JEN-N3T-84D9"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        backgroundColor: '#D1FAE5',
                        border: '1px solid #6EE7B7',
                        borderRadius: '8px',
                        padding: '16px',
                        textDecoration: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontWeight: 'bold', color: '#1F2937', margin: '0 0 4px 0' }}>Marcus HYSA</p>
                          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Earn .25% bonus APY</p>
                        </div>
                        <span style={{ color: '#059669', fontWeight: 'bold' }}>Open →</span>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {showAdLimitModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
                🎬 Watch an Ad to Save More
              </h3>
              <p style={{ color: '#6B7280', marginBottom: '24px' }}>
                You've reached your free save limit ({FREE_SAVE_LIMIT} items). Watch a short video ad to save this decision!
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowAdLimitModal(false)}
                  style={{
                    flex: 1,
                    ...styles.button,
                    backgroundColor: '#F3F4F6',
                    color: '#374151'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={watchAdToSave}
                  style={{
                    flex: 1,
                    ...styles.button,
                    ...styles.buttonPrimary
                  }}
                >
                  Watch Ad
                </button>
              </div>
            </div>
          </div>
        )}

        {showTipModal && currentTip && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '450px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '48px' }}>{currentTip.icon}</span>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center', color: '#1F2937' }}>
                {currentTip.title}
              </h3>
              <p style={{ color: '#4B5563', marginBottom: '24px', lineHeight: '1.6', fontSize: '16px' }}>
                {currentTip.description}
              </p>
              
              {currentTip.buttons.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  {currentTip.buttons.map((button, index) => (
                    <a
                      key={index}
                      href={button.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        ...styles.button,
                        ...styles.buttonEmerald,
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'block'
                      }}
                    >
                      {button.text}
                    </a>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  setShowTipModal(false);
                  setCurrentTip(null);
                }}
                style={{
                  width: '100%',
                  ...styles.button,
                  backgroundColor: '#F3F4F6',
                  color: '#374151'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {savedItems.length > 0 && (
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                💰 Savings Tracker
              </h2>
              <span style={{ fontSize: '14px', color: '#6B7280' }}>
                {savedItems.length} / {FREE_SAVE_LIMIT} saves
              </span>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #34D399 0%, #14B8A6 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: 'white',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Total Overview</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.9 }}>Total Saved:</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>${getTotalSavings().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.9 }}>Future Value:</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>${getTotalFutureValue().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '12px' }}>
                  <span style={{ opacity: 0.9 }}>Potential Gain:</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#FDE047' }}>+${(getTotalFutureValue() - getTotalSavings()).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {monthlyGroups.map(([key, group]) => (
              <div key={key} style={{ border: '2px solid #E5E7EB', borderRadius: '12px', marginBottom: '16px', overflow: 'hidden' }}>
                <button
                  onClick={() => setExpandedMonth(expandedMonth === key ? null : key)}
                  style={{
                    width: '100%',
                    backgroundColor: '#F9FAFB',
                    padding: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calendar style={{ width: '20px', height: '20px', color: '#6B7280' }} />
                    <span style={{ fontWeight: 'bold', color: '#1F2937' }}>{group.name}</span>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>({group.items.length} items)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontWeight: 'bold', color: '#10B981' }}>${group.total.toFixed(2)}</span>
                    {expandedMonth === key ? <ChevronUp style={{ width: '20px', height: '20px' }} /> : <ChevronDown style={{ width: '20px', height: '20px' }} />}
                  </div>
                </button>

                {expandedMonth === key && (
                  <div style={{ padding: '16px', backgroundColor: 'white' }}>
                    {group.items.map(item => (
                      <div key={item.id} style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontWeight: 'bold', color: '#1F2937', margin: '0 0 4px 0' }}>{item.name}</h4>
                          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 8px 0' }}>
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                          <div style={{ fontSize: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ color: '#6B7280' }}>Saved:</span>
                              <span style={{ fontWeight: '600', color: '#1F2937' }}>${item.amount.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ color: '#6B7280' }}>Hours avoided:</span>
                              <span style={{ fontWeight: '600', color: '#1F2937' }}>{item.hours.toFixed(1)} hrs</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#6B7280' }}>Future value:</span>
                              <span style={{ fontWeight: '600', color: '#10B981' }}>${item.futureValue.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteItem(item.id)}
                          style={{
                            marginLeft: '16px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <Trash2 style={{ width: '20px', height: '20px' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
