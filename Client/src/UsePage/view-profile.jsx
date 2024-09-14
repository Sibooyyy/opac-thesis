import { AuthContext } from "../App";
import { useContext } from "react";

function ViewProfile() {

    const { user, isLoggedIn  } = useContext(AuthContext);  




    return (
            <div className='w-[100%] h-screen p-[60px] bg-[#0CA1E2] flex flex-col items-center font-poppins gap-10'>
            <h1 className='text-[white] text-[25px] font-bold'>My Profile</h1>
            <div className='mt-4 w-full'>
                {isLoggedIn && user ? (
                <div className="flex flex-col mt-4 ">
                    <div className="flex items-center gap-10">
                        <h1 className="text-[white] text-[25px] font-bold">Name:</h1>
                        <p className="text-[white] text-[22px]">{user.firstname} {user.lastname}</p>
                    </div>
                    <div className="flex items-center gap-10">
                        <h1 className="text-[white] text-[25px] font-bold">Designation:</h1>
                        <p className="text-[white] text-[22px]">{user.designation}</p>
                    </div>
                    <div className="flex items-center gap-10">
                        <h1 className="text-[white] text-[25px] font-bold">ID Number:</h1>
                        <p className="text-[white] text-[22px]">{user.idNumber}</p>
                    </div>
                    <div className="flex items-center gap-10">
                        <h1 className="text-[white] text-[25px] font-bold">Contact:</h1>
                        <p className="text-[white] text-[22px]">{user.contactNumber}</p>
                    </div>
                </div>
                ) : (
                <div className="text-white mt-4">
                    <p>Please log in to view your profile.</p>
                </div>
                )}
                </div>
            </div>
    );
}


export default ViewProfile;
