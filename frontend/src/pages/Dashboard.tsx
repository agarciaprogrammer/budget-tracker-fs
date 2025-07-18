import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/global.module.css';
import { getExpenses } from '../services/expenseService';
import { getIncomes } from '../services/incomeService';
import { getCategories } from '../services/categoryService';
import { getFixedExpensesByUserId } from '../services/fixedExpenseService';
import { getCurrentUser } from '../services/authService';
import type { Expense, Income, Category, FixedExpense } from '../types';
import type { TooltipProps } from 'recharts';
import { formatMoney } from '../utils/formatMoney';
import { getLocalDateFromStr, isSameMonth } from '../utils/dateUtils';
import LoadingSpinner from '../components/LoadingSpinner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const currentUser = getCurrentUser();

  const fetchData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [expensesData, incomesData, categoriesData, fixedExpensesData] = await Promise.all([
        getExpenses(),
        getIncomes(),
        getCategories(),
        getFixedExpensesByUserId(currentUser.id)
      ]);

      // Calculate the date 6 months before the current month
      const sixMonthsAgo = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 5, 1);
      const endOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      // Filter data for the last 6 months using the new utility
      const filteredExpenses = expensesData.filter(expense => {
        const expenseDate = getLocalDateFromStr(expense.date);
        return expenseDate >= sixMonthsAgo && expenseDate <= endOfCurrentMonth;
      });

      const filteredIncomes = incomesData.filter(income => {
        const incomeDate = getLocalDateFromStr(income.date);
        return incomeDate >= sixMonthsAgo && incomeDate <= endOfCurrentMonth;
      });

      const filteredFixedExpenses = fixedExpensesData.filter(fixedExpense => {
        const fixedExpenseDate = getLocalDateFromStr(fixedExpense.startDate);
        return fixedExpenseDate >= sixMonthsAgo && 
               fixedExpenseDate <= endOfCurrentMonth &&
               fixedExpense.isActive;
      });

      setExpenses(filteredExpenses);
      setIncomes(filteredIncomes);
      setCategories(categoriesData.filter(cat => cat.userId === currentUser.id));
      setFixedExpenses(filteredFixedExpenses);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentMonth(newDate);
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleString('us', { month: 'long', year: 'numeric' });
  };

  const calculateKPIs = () => {
    // Filter data for current month only using the new utility
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = getLocalDateFromStr(expense.date);
      return isSameMonth(expenseDate, currentMonth);
    });

    const currentMonthIncomes = incomes.filter(income => {
      const incomeDate = getLocalDateFromStr(income.date);
      return isSameMonth(incomeDate, currentMonth);
    });

    const currentMonthFixedExpenses = fixedExpenses.filter(fixedExpense => {
      const fixedExpenseDate = getLocalDateFromStr(fixedExpense.startDate);
      return isSameMonth(fixedExpenseDate, currentMonth) && fixedExpense.isActive;
    });

    const totalExpenses = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = currentMonthIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalFixedExpenses = currentMonthFixedExpenses.reduce((sum, fe) => sum + fe.amount, 0);
    const totalSalary = currentMonthIncomes
      .filter(income => income.type === 'salary')
      .reduce((sum, income) => sum + income.amount, 0);

    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    return {
      totalExpenses,
      totalIncome,
      totalFixedExpenses,
      totalSalary,
      savings: totalIncome - totalExpenses - totalFixedExpenses,
      salaryPercentage: totalSalary ? ((totalExpenses + totalFixedExpenses) / totalSalary) * 100 : 0,
      averageDailySpending: (totalExpenses + totalFixedExpenses) / daysInMonth
    };
  };

  const prepareCategoryData = () => {
    // Filter expenses for current month only
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = getLocalDateFromStr(expense.date);
      return isSameMonth(expenseDate, currentMonth);
    });

    const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
      const category = categories.find(cat => cat.id === expense.categoryId);
      const categoryName = category ? category.name : 'No category';
      acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value
    }));
  };

  const prepareMonthlyData = (): MonthlyData[] => {
    const months: MonthlyData[] = [];
    
    // Get data for last 6 months from the selected month
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i, 1);
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = getLocalDateFromStr(expense.date);
        return isSameMonth(expenseDate, date);
      });
      
      const monthIncomes = incomes.filter(income => {
        const incomeDate = getLocalDateFromStr(income.date);
        return isSameMonth(incomeDate, date);
      });

      months.push({
        month: date.toLocaleString('es-AR', { month: 'short' }),
        income: monthIncomes.reduce((sum, inc) => sum + inc.amount, 0),
        expenses: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      });
    }

    return months;
  };

  const calculateSpendingTrend = () => {
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = getLocalDateFromStr(expense.date);
      return isSameMonth(expenseDate, currentMonth);
    });
    const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const previousMonthExpenses = expenses.filter(expense => {
      const expenseDate = getLocalDateFromStr(expense.date);
      return isSameMonth(expenseDate, previousMonth);
    });
    const previousMonthTotal = previousMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    if (previousMonthTotal === 0) return 0;
    return ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
  };

  

  const CustomPieTooltip = ({ active, payload }: TooltipProps<'value', string>) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <div style={{ background: 'white', color: 'black', padding: '8px', borderRadius: '4px' }}>
          <span>{name}: ${value}</span>
        </div>
      );
    }
    return null;
  };

  const kpis = calculateKPIs();
  const categoryData = prepareCategoryData();
  const monthlyData = prepareMonthlyData();
  const spendingTrend = calculateSpendingTrend();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <div className={styles.headerActions}>
          <div className={styles.monthNavigation}>
            <button 
              className={styles.monthButton}
              onClick={() => changeMonth('prev')}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span className={styles.currentMonth}>
              {getMonthName(currentMonth)}
            </span>
            <button 
              className={styles.monthButton}
              onClick={() => changeMonth('next')}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <h3>Total Income</h3>
              <p>${formatMoney(kpis.totalIncome)}</p>
            </div>
            <div className={styles.summaryItem}>
              <h3>Total Expenses</h3>
              <p>${formatMoney(kpis.totalExpenses)}</p>
            </div>
            <div className={styles.summaryItem}>
              <h3>Remaining Budget</h3>
              <p className={kpis.savings < 0 ? styles.negative : styles.positive}>
                ${formatMoney(kpis.savings)}
              </p>
            </div>
            <div className={styles.summaryItem}>
              <h3>% of Salary</h3>
              <p>{kpis.salaryPercentage.toFixed(1)}%</p>
            </div>
            <div className={styles.summaryItem}>
              <h3>Average Daily Expense</h3>
              <p>${formatMoney(kpis.averageDailySpending)}</p>
            </div>
            <div className={styles.summaryItem}>
              <h3>Spending Trend</h3>
              <p className={spendingTrend > 0 ? styles.negative : styles.positive}>
                {spendingTrend > 0 ? '+' : ''}{spendingTrend.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className={styles.chartsContainer}>
            <div className={styles.chartCard}>
              <h3>Income vs Expenses (Last 6 months)</h3>
              <div style={{ width: '100%', height: 300}}>
                <ResponsiveContainer>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#8884d8" />
                    <Bar dataKey="expenses" name="Expenses" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3>Distribution by Category</h3>
              <div style={{ width: '100%', height: 300}}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      fontSize={14}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomPieTooltip />}
                      contentStyle={{ 
                        color: 'black',
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3>Spending Trend</h3>
              <div style={{ width: '100%', height: 300}}>
                <ResponsiveContainer>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      name="Expenses" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3>Most used categories</h3>
              <div style={{ width: '100%', height: 300, overflowY: 'auto', padding: '20px' }}>
                {categoryData
                  .sort((a, b) => b.value - a.value)
                  .map((category, index) => {
                    const total = categoryData.reduce((sum, item) => sum + item.value, 0);
                    const percentage = ((category.value / total) * 100).toFixed(1);
                    return (
                      <div 
                        key={category.name}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px',
                          borderBottom: '1px solid #eee',
                          color: 'white'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div 
                            style={{ 
                              width: '12px', 
                              height: '12px', 
                              backgroundColor: COLORS[index % COLORS.length],
                              borderRadius: '50%'
                            }} 
                          />
                          <span>{category.name}</span>
                        </div>
                        <div>
                          <span style={{ marginRight: '15px' }}>{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
