import React, {useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from "../component/common/Navbar.jsx";
import Content from "../component/home/Content.jsx";
import LeftSide from "../component/common/LeftSide.jsx";
import RightSide from "../component/common/RightSide.jsx";
import './css/HomePage.css';
import {useDispatch, useSelector} from "react-redux";
import {fetchUserHistory} from "../redux/historySlice.js";
import Footer from "../component/common/Footer.jsx";
import Banner from "../component/common/Banner.jsx";

export default function HomePage() {
    const user = useSelector((state) => state.user.data);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!user) return;
        dispatch(fetchUserHistory(user.id));
    }, [user, dispatch]);

    return (
        <div className="homepage-container">
            <Navbar />
            {/*<Banner/>*/}
            <div className="main-layout">
                <LeftSide />

                <main className="content-area">
                    <Routes>
                        <Route index element={<Content />} />
                    </Routes>
                </main>

                <RightSide user={user} />
            </div>
            <Footer/>
        </div>
    );
}