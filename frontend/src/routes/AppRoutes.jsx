import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Layouts
import MainLayout from '../components/layout/MainLayout'
import AdminLayout from '../components/layout/AdminLayout'

// Main Pages
import UserLogin from '../pages/UserLogin'
import UserRegister from '../pages/UserRegister'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'
import About from '../pages/About' // You were missing this import
import Services from '../pages/Services'
import Contact from '../pages/Contact'
import Bookpg from '../pages/Bookpg'
import Adminlogin from '../pages/Adminlogin'
import AdminRegister from '../pages/AdminRegister'
import PaymentSuccess from '../pages/PaymentSuccess';

// Admin Pages
import AdminDashboard from '../admin/Dashboard'
import ServicesAddManage from '../admin/ServicesAddManage'
import ContactManagement from '../admin/ContactManagement'
import Footeraddandmanage from '../admin/Footeraddandmanage'
import Managerooms from '../admin/Managerooms'
import SetupBuilding from '../admin/SetupBuilding'
import Galleryaddandmanage from '../admin/Galleryaddandmanage'
import BookingDetails from '../admin/BookingDetails'
import Paymenthistory from '../admin/Paymenthistory'
import Herosectionaddmanage from '../admin/Herosectionaddmanage'
import AboutAddAndManage from '../admin/AboutAddAndManage';

// Protected Route Component
import AdminProtected from '../utils/AdminProtected'


function AppRoutes() {
  return (
    <Router>
        <Routes>
            {/* 1. Public Routes with Header and Footer */}
            <Route element={<MainLayout />}>
                <Route index element={<Home/>}/>
                <Route path='home' element={<Home/>}/>
                <Route path='about' element={<About/>}/>
                <Route path='services' element={<Services />}/>
                <Route path='contact' element={<Contact />}/>
                <Route path='bookingpg' element={<Bookpg />}/>
                <Route path='payment-success' element={<PaymentSuccess />}/>
                <Route path='login' element={<UserLogin />} />
                <Route path='register' element={<UserRegister />} />
                <Route path='dashboard' element={<Dashboard />} />
            </Route>

            {/* 2. Admin Authentication Routes (No Header or Footer) */}
            <Route path='adminlogin' element={<Adminlogin/>}/>
            <Route path='adminregister' element={<AdminRegister/>}/>
       
            {/* 3. Admin Panel Routes (Protected with AdminProtected) */}
            <Route path='/admin' element={<AdminProtected><AdminLayout /></AdminProtected>}>
                <Route path='dashboard' element={<AdminDashboard />}/>
                <Route path='aboutaddmanage' element={<AboutAddAndManage />}/>
                <Route path='herosectionaddmanage' element={<Herosectionaddmanage />}/>
                <Route path='servicesaddmanage' element={<ServicesAddManage />}/>
                <Route path='galleryaddandmanage' element={<Galleryaddandmanage />}/>
                <Route path='footeraddandmanage' element={<Footeraddandmanage />}/>
                <Route path='managerooms' element={<Managerooms />}/>
                <Route path='bookingdetails' element={<BookingDetails />}/>
                <Route path='contactmanagement' element={<ContactManagement />}/>
                <Route path='setupbuilding' element={<SetupBuilding />}/>
                <Route path='paymenthistory' element={<Paymenthistory />}/>
              </Route>
         </Routes>
    </Router>
  )
}

export default AppRoutes