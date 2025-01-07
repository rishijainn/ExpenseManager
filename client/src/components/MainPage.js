import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { VictoryPie, VictoryTooltip } from 'victory';
import { marked } from 'marked';
import Spinner from './Spinner'; // Importing the spinner component

function MainPage({ totalBud, totalEnc, totalExp, expense, setLoading, loading }) {
    const data = [
        { x: "Total Budget", y: totalBud },
        { x: "Total Income", y: totalEnc },
        { x: "Total Expense", y: totalExp },
    ];

    const colors = [
        "#FFB6C1", "#FFD700", "#98FB98", "#AFEEEE", "#DDA0DD", "#FFA07A", "#20B2AA",
        "#7FFFD4", "#FF69B4", "#FF6347", "#32CD32", "#4682B4"
    ]
    const [expenseData, setExpenseData] = useState([]);
    const [alert, setAlert] = useState(null);
    const [question, setQuestion] = useState('');
    const [finalAns, setFinalAns] = useState(null);
    const UserName = localStorage.getItem("name");

    useEffect(() => {
        // Set financial alerts
        if (totalEnc < totalExp) {
            setAlert("Your Expense is higher than your Income");
        } else if (totalEnc < totalBud) {
            setAlert("Your Budget is higher than your Income");
        } else {
            setAlert('');
        }

        // Prepare expense data for visualization
        const expenseDataArray = expense.map((exp) => ({ x: exp.description, y: exp.amount }));
        // setExpenseData(expenseDataArray);

        // Call function to send request to AI API
        expenseBreaker(expenseDataArray);
    }, [totalBud, totalEnc, totalExp, expense]);

    // Function to interact with AI to break down expenses
    const expenseBreaker = (expenseData) => {
        const prompt = `Break down the following expense data into different genres and provide the response in JSON format only. 
        Do not include any extra formatting, such as backticks or code blocks. 
        The response should look like:
        [
            {
                "x": "genre_name",
                "y": amount
            }
        ]

        The expense data is ${JSON.stringify(expenseData)}`;

        setLoading(true);

        axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAvzjNE-xRGMYNn9Y7epl3MvuniAiz8_tI",
            { "contents": [{ "parts": [{ "text": prompt }] }] }
        )
            .then((response) => {
                const responseData = response.data.candidates[0].content.parts[0].text;
                try {
                    const parsedData = JSON.parse(responseData);
                    console.log(parsedData);
                    setExpenseData(parsedData);
                } catch (e) {
                    console.log("Error parsing response:", e);
                }
            }).catch((error) => {
                console.log("There is some issue with the Bot, please try again later", error);
            }).finally(() => {
                setLoading(false); // Moved here to ensure it's called after the request completes
            });
    }

    const onChangeHandler = (e) => {
        setQuestion(e.target.value);
    }

    const AiHandler = (e) => {
        setLoading(true);
        e.preventDefault();
        axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAvzjNE-xRGMYNn9Y7epl3MvuniAiz8_tI",
            { "contents": [{ "parts": [{ "text": `${question}. answer this question if it is related to finnace athere wise just return "please enter finance related question" and Do not include any extra formatting, such as backticks or code blocks. ` }] }] }
        )
            .then((response) => {
                setFinalAns(response.data.candidates[0].content.parts[0].text);
                setQuestion('');
            }).catch((error) => {
                console.log("There is some issue with the Bot, please try again laterrrrr", error);
            }).finally(() => {
                setLoading(false); // Moved here to ensure it's called after the request completes
            });
    }

    const shortSearchHandler = (no) => {
        setLoading(true);
        axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAvzjNE-xRGMYNn9Y7epl3MvuniAiz8_tI",
            { "contents": [{ "parts": [{ "text": no }] }] }
        )
            .then((response) => {
                const formatted = marked.parse(response.data.candidates[0].content.parts[0].text);
                setFinalAns(formatted);
                setQuestion('');
            }).catch((error) => {
                console.log("There is some issue with the Bot, please try again later", error);
            }).finally(() => {
                setLoading(false); // Moved here to ensure it's called after the request completes
            });
    }

    return (
        <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-10">
            {loading && <Spinner />} {/* Show spinner when loading */}

            <div className="max-w-5xl mx-auto">
            <header className="text-center mb-10">
    <h1 className="font-bold sm:text-4xl text-3xl text-gray-800 mb-4">
        Welcome, {UserName}
    </h1>

    <div className="mx-auto max-w-3xl px-4">
        {totalBud === 0 && totalEnc === 0 && totalExp === 0 ? (
            <p className="text-gray-700 text-lg leading-relaxed">
                <span className="text-green-500">🎉 You're all set to manage your finances!</span>
                <br />
                It looks like you haven't added any expenses or income yet. Start by adding your first expense or income to see your financial progress and keep track of your spending and savings.
                It’s quick, easy, and will help you stay on top of your finances. Let’s get started!
            </p>
        ) : (
            <p className="text-gray-600 text-lg mt-4">
                Here's an overview of your financial activity
            </p>
        )}
    </div>
</header>


                {alert && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md">
                        <p>{alert}</p>
                    </div>
                )}

                <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10 ">
                    {[
                        { title: "Total Budget", value: totalBud, color: "text-indigo-600" },
                        { title: "Total Income", value: totalEnc, color: "text-green-600" },
                        { title: "Total Expense", value: totalExp, color: "text-red-600" },
                        { title: "Remaining Balance", value: totalEnc - totalExp, color: "text-yellow-600" },
                    ].map((item, index) => (
                        <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">{item.title}</h2>
                            <h3 className={`text-3xl font-bold ${item.color}`}>{item.value}</h3>
                        </div>
                    ))}
                </section>

                <div>
                    {totalBud == 0 && totalEnc == 0 && totalExp == 0 ?
                        (null) :
                        (<section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Financial Breakdown</h2>
                                <VictoryPie 
                                    data={data}
                                    colorScale={["#5A67D8", "#38A169", "#E53E3E"]}
                                    labelComponent={<VictoryTooltip />}
                                    style={{ labels: { fill: "black", fontSize: 14, fontWeight: "bold" }, }}
                                    innerRadius={70}
                                    animate={{ duration: 1000, easing: "bounce" }}
                                />
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Expense Breakdown</h2>
                                <VictoryPie
                                    data={expenseData}
                                    labelComponent={<VictoryTooltip />}
                                    colorScale={colors.slice(0, expenseData.length)}
                                    style={{ labels: { fill: "black", fontSize: 14, fontWeight: "bold" } }}
                                    innerRadius={70}
                                    animate={{ duration: 1000, easing: "bounce" }}
                                />
                            </div>
                        </section>)}
                </div>


                <section className="mb-8">
                    <h1 className="text-xl font-semibold text-gray-700 mb-4">Ask AI</h1>
                    <div className="flex flex-wrap gap-4">
                        {[
                            "ways to create more income resources",
                            "can you give me some tips to save money",
                            "can you help me to know about smart money"
                        ].map((text, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-50 border border-gray-300 rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => shortSearchHandler(text)}
                            >
                                <h2 className="text-gray-800">{text}</h2>
                            </div>
                        ))}
                    </div>
                </section>

                <form onSubmit={AiHandler} className="flex items-center space-x-4 mb-8">
                    <input
                        type="text"
                        onChange={onChangeHandler}
                        placeholder="Ask Financial Bot"
                        value={question}
                        className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                        type="submit"
                        className="p-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                    >
                        Submit
                    </button>
                </form>

                {finalAns && (
                    <div>
                        <div
                        className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: finalAns }}
                    ></div>
                    <button onClick={()=>setFinalAns(null)} className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300">
                        Close
                    </button>
                    </div>
                    
                    
                )}
            </div>
        </div>
    );
}

export default MainPage;
