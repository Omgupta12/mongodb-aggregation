/*
Task is to write down the MongoDB Aggregation Operations for the given SQL queries
*/
SELECT * FROM employees;

SELECT _id, firstName, lastName FROM employees WHERE _id = 1;

SELECT _id, lastName FROM employees WHERE age = 30 ORDER BY lastName asc;

SELECT firstName, age FROM employees WHERE age > 30 GROUP BY firstName, age ORDER BY firstName;

SELECT cust_id, SUM(price) FROM orders GROUP BY cust_id HAVING SUM(price) >= 100

SELECT COUNT(age), age FROM employees WHERE age <= 30 GROUP BY age ORDER BY age

SELECT SUM(age) FROM employees WHERE age <= 30;

SELECT AVG(age) FROM employees;

SELECT DISTINCT _id FROM employees;

SELECT * From employees WHERE firstName LIKE '%oti%';

SELECT _id FROM employees WHERE age BETWEEN 20 AND 30;

SELECT * FROM employees INNER JOIN desks ON employees._deskId = desks._id;

SELECT COUNT(_id), age FROM employees GROUP BY age HAVING COUNT(_id) > 0;




