import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../App.css';


const Profile = (props) => {

    let base_url = 'http://localhost:3006/api/user/'

    const [profileData, setProfileData] = useState(undefined);
    const [profileId, setprofileId] = useState('')
    const [loading, setloading] = useState(true);


    useEffect(() => {
        async function fetchData() {
            try {
                const user_info = await axios.get(base_url + 'asdfghjklasdfghjklas');
                console.log(user_info)
                setProfileData(user_info);
                setloading(false);
            } catch (e) {
                console.log(e)
            }
        }
        fetchData();
    }, []);


    const each_stock = (stock_name) => {
        return <p>{stock_name + '\t'}</p>
    }
    if(loading){
        return <div>loading</div>
    }
    else{
        let html_stock_list = profileData.stockList.map((stock_name) => {
            return each_stock(stock_name);
        })


        return (
            <div>
                <h1>User Name: {profileData.userName}</h1>
    
                <h1>User Name: {profileData.profileImg}</h1>
    
                {html_stock_list}
    
    
            </div>
        )
    }



    

};

export default Profile;