import React from "react";

const Skeleton = () => {
  const rows = Array.from({ length: 6 });

  return (
    <>
      {rows.map((_, index) => (
        <div
          className="grid grid-cols-12 text-sm text-[#4A4A4A]  font-medium items-center gap-3 divide-gray-200 animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 "
          key={index}
        >
          <div className="col-span-3">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-28"></div>
            </div>
          </div>
          <div className="col-span-3">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600   w-28"></div>
            </div>
          </div>
          <div className="col-span-1">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-16 "></div>
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-16"></div>
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-20"></div>
            </div>
          </div>
          <div className="col-span-1">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Skeleton;
