import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TopNavbar from '../components/TopNavbar';
import Budget from '../components/Budget';
import axios from 'axios';
import Income from '../components/Income';
import Expense from '../components/Expense';
import MainPage from '../components/MainPage';
import Profile from '../components/Profile';
import Groups from '../components/Groups';
import { useNavigate } from 'react-router-dom';
import { FcBusinessman } from "react-icons/fc";
import { FcBusinesswoman } from "react-icons/fc";
function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);
  const [totalBud, setTotalBud] = useState(0);
  const [totalEnc, setTotalEnc] = useState(0);
  const [totalExp, setTotalExp] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [theme, setTheme] = useState(true); // true for day, false for night
  const [profileImage, setProfileImage] = useState(null);
  const [isProfile,setIsProfile]=useState('');
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const id=localStorage.getItem("user_id");

  useEffect(() => {
     console.log("hello");
      getBud(); 
      getExp();
      getInc();
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
  
      // Add resize event listener
      window.addEventListener('resize', handleResize);
  
      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
 
    
  }, [isLoggedIn, setIsLoggedIn]);


  const getBud = () => {
    axios.get("https://expense-manager-backend-eight.vercel.app/user/data/Budget/get", {
      withCredentials: true
    }).then((response) => {
      const budgetData = response.data.data;
      setBudgets(budgetData);
      const totalBudgetAmount = budgetData.reduce((sum, budget) => sum + budget.totalBudget, 0);
      setTotalBud(totalBudgetAmount);
    }).catch(() => {
      console.log("Some problem in fetching data");
    });
  };

  const getInc = () => {
    axios.get("https://expense-manager-backend-eight.vercel.app/user/data/Income/get", { withCredentials: true })
      .then((response) => {
        setIsLoggedIn(true);
        const incomeData = response.data.data;
        setIncome(incomeData);
        const totalIncomeAmount = incomeData.reduce((sum, inc) => sum + inc.amount, 0);
        setTotalEnc(totalIncomeAmount);
        console.log("hellloooooooo")
      })
      .catch((error) => {
        if(error.response.data.message==="Please SignUp"){
          setIsLoggedIn(false);
          console.log(isLoggedIn);
        }
        console.log(error.response.data.message);
      });

      
  };

  const getExp = () => {
    axios.get("https://expense-manager-backend-eight.vercel.app/user/data/expense/get", { withCredentials: true })
      .then((response) => {
        const expenseData = response.data.data;
        setExpense(expenseData);
        const totalExpenseAmount = expenseData.reduce((sum, exp) => sum + exp.amount, 0);
        setTotalExp(totalExpenseAmount);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Budget':
        return <Budget budgets={budgets} setBudgets={setBudgets} setTotalBud={setTotalBud} loading={loading} totalBud={totalBud} theme={theme}/>;
      case 'Income':
        return <Income Income={income} setIncome={setIncome} loading={loading} setLoading={setLoading} totalEnc={totalEnc} setTotalEnc={setTotalEnc} theme={theme} />;
      case 'Expenses':
        return <Expense Expense={expense} setExpense={setExpense} loading={loading} setLoading={setLoading} totalExp={totalExp} setTotalExp={setTotalExp} theme={theme} />;
      // case 'profile':
      //   return <Profile totalBud={totalBud} totalEnc={totalEnc} totalExp={totalExp} theme={theme} />;
      case 'Manager':
        return <Groups theme={theme} />;
      default:
        return <MainPage totalBud={totalBud} totalEnc={totalEnc} totalExp={totalExp} expense={expense} setLoading={setLoading} loading={loading} theme={theme} getBud={getBud} getExp={getExp} getInc={getInc} />;
    }
  };

  return (
    <div className={`min-h-screen flex ${theme ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 text-gray-100'}`}>
      {isLoggedIn ? (
        <div className="flex w-full">
          
          <div className={`fixed top-0 left-0 h-full w-64 md:block hidden z-10 ${theme ? 'bg-white' : 'bg-gray-800'}`}>
            {/* {windowSize.width>=768?():} */}
            <Navbar setActiveSection={setActiveSection} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profileImage={profileImage}  setProfileImage={setProfileImage}/>
          </div>
          <div className="flex-1 flex flex-col md:ml-64 ml-0 overflow-y-auto">
            <div className={`fixed top-0 md:left-64 md:w-[calc(100%-16rem)] w-full z-10  ${theme ? 'bg-white' : 'bg-gray-800'}`}>
              <TopNavbar setActiveSection={setActiveSection} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} budgets={budgets} Income={income} Expense={expense} theme={theme} setTheme={setTheme} setIsProfile={setIsProfile} profileImage={profileImage} isProfile={isProfile} setProfileImage={setProfileImage} />
            </div>
            <div className="mt-16 ">
              {renderContent()}
              <div>
                {isProfile?
                (<div>
                  <div className='p-4'>
                  <FcBusinessman />
                  </div>
                  <div className='p-4'>
                  <FcBusinesswoman />

                  </div>
                </div>):
                (null)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full">
          <div className={`fixed top-0 left-0 h-full w-64 md:block hidden z-10 ${theme ? 'bg-white' : 'bg-gray-800'}`}>
            <Navbar setActiveSection={setActiveSection} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setProfileImage={setProfileImage} />
          </div>
          <div className="flex-1 flex flex-col md:ml-64 ml-0 overflow-y-auto">
            <div className={`fixed top-0 md:left-64 md:w-[calc(100%-16rem)] w-full z-10  ${theme ? 'bg-white' : 'bg-gray-800'}`}>
              <TopNavbar setActiveSection={setActiveSection} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} budgets={budgets} Income={income} Expense={expense} theme={theme} setTheme={setTheme} />
            </div>
            <div className="mt-16 ">
              <div className={`flex flex-col items-center justify-center min-h-screen text-center ${theme ? 'bg-blue-50 text-blue-700' : 'bg-gray-900 text-gray-100'} p-8`}>
                <h1 className="text-4xl font-bold mb-4">Welcome to Expense Tracker</h1>
                <p className="text-lg mb-6">
                  Manage your finances effortlessly and make informed decisions.
                  Track your income, budget, and expenses all in one place.
                </p>
                <p className="text-sm mb-8">
                  Sign in to get started, or join us to take control of your financial journey today!
                </p>
                <button
                  onClick={() => { navigate('/login') }}
                  className={`px-6 py-2 ${theme ? 'bg-blue-600' : 'bg-gray-700'} text-white font-semibold rounded-lg shadow-md hover:${theme ? 'bg-blue-500' : 'bg-gray-600'} focus:outline-none focus:ring-2 focus:ring-${theme ? 'blue' : 'gray'}-400 focus:ring-opacity-75`}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
