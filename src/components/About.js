import React from 'react';
import '../App.css';
import { List, Avatar } from 'antd';
const About = () => {

    const data = [
        {
            title: 'Peijin Zhou',
            github:"https://github.com/PeijinZhou"
        },
        {
            title: 'Jiashu Wang',
            github:"https://github.com/39xdgy"
        },
        {
            title: 'Ying Liu',
            github:"https://github.com/yingliu928"

        },
        {
            title: 'Vishal Manjunath',
            github:"https://github.com/vishm08"
        },
        {
            title: 'Shaunak Saklikar',
            github:""
        },
    ];
    return (
        <div>
            <p className="chartName">Group Members</p>
            <br/>
            <p>We are CS graduate students of Stevens Insititute of Technology.</p>
        <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                     
                        title={<a href="https://ant.design">{item.title}</a>}
                        description={<a href={item.github}>{item.github}</a>}
                    />
                </List.Item>
            )}
        />
        </div>

   
    )
};

export default About;