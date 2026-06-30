import LikedContent from "@/components/likedcontent";
import React, { Suspense, useEffect, useState } from "react";

const index = () => {
    return (
        <div>
            <div>
                <h1>Liked Videos</h1>
                <Suspense fallback={<div>Loading...</div>}>
                    <LikedContent />
                </Suspense>
            </div>
        </div>
    );
};

export default index;