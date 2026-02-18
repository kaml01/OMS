import React from 'react'

export default function App_User() {
    
  return (
    <div>
        <>
      <div className='top-bar'>
        <div style={{marginLeft:"20px"}}>Users</div>
        <button >Add Users</button>
      </div>


    <style>
        {
            `
            .top-bar{
                border-bottom:2px solid #1f2038;
                display: flex;
                align-items: center;
                background: #424ab2;
                color: white;
                height:
                50px;
            }

            button{
            margin-left:auto;
            background:
            #10188a;
            color: white;
            border: none;
            margin-right: 10px
            }
            `
        }
    </style>

      </>
    </div>
  )
}
