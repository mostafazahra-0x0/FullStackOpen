const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ part, exercises }) => <div>{part} {exercises}</div>

const Content = ({ parts }) => (
<div>
    {parts.map(part =>
    <Part key={part.id} part={part.name} exercises={part.exercises} />
    )}
</div>
)

const Total = ({ parts }) => (
<p>total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</p>
)

const Course = ({ course }) => (
<div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
</div>
)

export default Course