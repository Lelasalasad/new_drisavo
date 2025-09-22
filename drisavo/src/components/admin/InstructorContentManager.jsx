import React, { useEffect, useState } from "react";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  // بيانات تسجيل الدخول (ثابتة مثل ما عطيتني)
  const adminCredentials = {
    email: "admin@gmail.com",
    password: "123456789",
    type: "admin",
  };

  useEffect(() => {
    const loginAndFetch = async () => {
      try {
        // 1- تسجيل دخول للحصول على التوكن
        const loginRes = await fetch("https://api.drisavo.ca/api/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adminCredentials),
        });

        const loginData = await loginRes.json();
        console.log("Login response:", loginData);

        if (!loginData.token) {
          console.error("No token received!");
          setLoading(false);
          return;
        }

        // حفظ التوكن بالـ localStorage
        localStorage.setItem("adminToken", loginData.token);

        // 2- جلب المدربين المقبولين باستخدام التوكن
        const res = await fetch(
          "https://api.drisavo.ca/api/api/getAcceptedInstructors",
          {
            headers: {
              Authorization: `Bearer ${loginData.token}`,
            },
          }
        );

        const instructorsData = await res.json();
        console.log("Instructors:", instructorsData);

        setInstructors(instructorsData);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    loginAndFetch();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Accepted Instructors</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Birthday</th>
            <th>Phone</th>
            <th>Car Image</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((ins) => (
            <tr key={ins.id}>
              <td>
                {ins.f_name} {ins.l_name !== "NULL" ? ins.l_name : ""}
              </td>
              <td>{ins.email}</td>
              <td>{ins.birthday}</td>
              <td>{ins.phone_number}</td>
              <td>
                <img src={ins.car_image_url} alt="car" width="100" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Instructors;
