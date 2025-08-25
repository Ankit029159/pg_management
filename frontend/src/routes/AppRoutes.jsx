import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Layouts
import MainLayout from '../components/layout/MainLayout'
import AdminLayout from '../components/layout/AdminLayout'

// Main Pages
import Home from '../pages/Home'
import About from '../pages/About' // You were missing this import
import Services from '../pages/Services'
import Contact from '../pages/Contact'
import Bookpg from '../pages/Bookpg'
import Adminlogin from '../pages/Adminlogin'

// Admin Pages
import Dashboard from '../admin/Dashboard'
import Aboutaddandmanagement from '../admin/Aboutaddandmanagement'
import ServicesAddManage from '../admin/ServicesAddManage'
import ContactManagement from '../admin/ContactManagement'
import Footeraddandmanage from '../admin/Footeraddandmanage'
import Managerooms from '../admin/Managerooms'
import SetupBuilding from '../admin/SetupBuilding'
import Galleryaddandmanage from '../admin/Galleryaddandmanage'
import BookingDetails from '../admin/BookingDetails'
import Paymenthistory from '../admin/Paymenthistory'
import Herosectionaddmanage from '../admin/Herosectionaddmanage'
// Note: You will need to import Galleryaddandmanage as well for the 'Galleryaddmanage' route

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
            </Route>

            {/* 2. Admin Login Route (No Header or Footer) */}
            <Route path='adminlogin' element={<Adminlogin/>}/>
       
            {/* 3. Admin Panel Routes (uses its own AdminLayout) */}
            <Route path='admin' element={<AdminLayout/>} >
                <Route index element={<Dashboard/>}/>
                <Route path='dashboard' element={<Dashboard/>}/>
                <Route path='aboutaddmanage' element={<Aboutaddandmanagement/>}/>
                <Route path='servicesaddmanage' element={<ServicesAddManage/>}/>
                <Route path='contactmanage' element={<ContactManagement />}/>
                <Route path='footermangement' element={<Footeraddandmanage/>}/>
                <Route path='Galleryaddmanage' element={<Galleryaddandmanage/>}/> {/* You might want to change this to the correct component */}
                <Route path='bookingdetails' element={<BookingDetails />} />
                <Route path='managerooms' element={<Managerooms/>}/>
                <Route path='setupbuilding' element={<SetupBuilding/>} />
                <Route path='paymenthistory' element={<Paymenthistory />}/>
                <Route path='herosectionaddmanage' element={<Herosectionaddmanage/>}/>
            </Route>
         </Routes>
    </Router>
  )
}

export default AppRoutes