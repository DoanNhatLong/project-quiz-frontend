import {Outlet} from "react-router-dom";
import React from "react";

export default function TeacherPage() {
    return (
        <div className="challenger-page-container">
            <div className="challenger-content-wrapper">
                <Outlet />
            </div>
        </div>
    );
}