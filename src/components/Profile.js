import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../firebase/Auth';
import '../App.css';


const Profile = (props) => {
    const currentUser = useContext(AuthContext)

    const [profileData, setProfileData] = useState(undefined);
    const [profileId, setprofileId] = useState('')
    const [loading, setloading] = useState(true);
    //let base_url = `http://ownstockmodel.herokuapp.com/api/user/${currentUser.currentUser.uid}`
    const base_url = `http://localhost:3006/api/user/${currentUser.currentUser.uid}`

    const updateProfile = async (event) => {
        event.preventDefault();
        let { userName, addStock, deleteStock } = event.target.elements;
        const user_info = await axios.get(base_url)
        let old_stock_list = user_info.data.stockList
        let updateName, updatestock;
        if(userName.value !== '') updateName = userName.value
        else updateName = user_info.data.userName
        if(addStock.value !== '') old_stock_list.push(addStock.value)
        if(deleteStock.value !== '' && !old_stock_list.includes(deleteStock.value)){

        }
        if(deleteStock.value !== '' && old_stock_list.includes(deleteStock.value)) {
            for(let i = 0; i < old_stock_list.length; i++){
                if(old_stock_list[i] === deleteStock.value){
                    old_stock_list.splice(i, 1);
                }
            }
        }
        try {
          await axios.patch(base_url, {userName: updateName, profileImg: '', stockList: old_stock_list})
          alert("Successfully update user info, Please refreash the page")
        } catch (error) {
          alert(error);
        }
      };


    useEffect(() => {
        async function fetchData() {
            try {
               // base_url = `http://ownstockmodel.herokuapp.com/api/user/${currentUser.currentUser.uid}`
                const user_info = await axios.get(base_url)
                
                if(user_info.data.userName === null && user_info.data.profileImg === null){
                    user_info = await axios.patch(base_url, {userName: currentUser.currentUser.email, profileImg: '', stockList: ['AAPL', 'IBM', 'NVDA']})
                }
                console.log(user_info)
                setProfileData(user_info.data);
                setloading(false);
            } catch (e) {
                console.log(e)
            }
        }
        fetchData();
    }, []);


    const each_stock = (stock_name) => {
        return <p key={stock_name}>{stock_name + '\t'}</p>
    }
    if(loading){
        return <div>loading</div>
    }
    else{
        console.log(profileData.stockList)
        let html_stock_list = profileData.stockList.map((stock_name) => {
            return each_stock(stock_name);
        })


        return (
            <div>
                <h1>User Name: {profileData.userName}</h1>
    
                <h1>User Img: {profileData.profileImg}</h1>

                <h2>Stock that is watching: </h2>
    
                {html_stock_list}

                <form onSubmit={updateProfile}>
                    <div className="form-group">
                    <label>
                        Change user name:
                        <input
                        className="form-control"
                        name="userName"
                        id="userName"
                        type="userName"
                        placeholder="userName"
                        />
                    </label>
                    </div>
                    <div className="form-group">
                    <label>
                        Add Stock:
                        <input
                        className="form-control"
                        name="addStock"
                        type="addStock"
                        placeholder="Add Stock"
                        />
                    </label>
                    </div>
                    <div className="form-group">
                    <label>
                        Remove Stock:
                        <input
                        className="form-control"
                        name="deleteStock"
                        type="deleteStock"
                        placeholder="Remove Stock"
                        />
                    </label>
                    </div>
                    <button type="submit">update profile</button>
                
                </form>
            </div>
        )
    }



    

};

export default Profile;