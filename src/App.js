import Calendar from "./components/calendar/Calendar";
import Teachers from "./components/teachers/Teachers";
import TeachersForm from "./components/teachers/TeachersForm";
import Subjects from "./components/subjects/Subjects";
import SubjectsForm from "./components/subjects/SubjectsForm";
import Series from "./components/series/Series";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Classrooms from "./components/classrooms/Classrooms";
import ClassroomsForm from "./components/classrooms/ClassroomsForm";
import SeriesForm from "./components/series/SeriesForm";

const App = () => {
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editingClassroomId, setEditingClassroomId] = useState(null);
  const [editingSeriesId, setEditingSeriesId] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Calendar />} />

      <Route path="/teachers">
        <Route
          path=""
          element={<Teachers setEditingTeacherId={setEditingTeacherId} />}
        />
        <Route
          path="form"
          element={
            <TeachersForm
              editingTeacherId={editingTeacherId}
              setEditingTeacherId={setEditingTeacherId}
            />
          }
        />
      </Route>

      <Route path="/subjects">
        <Route
          path=""
          element={<Subjects setEditingSubjectId={setEditingSubjectId} />}
        />
        <Route
          path="form"
          element={
            <SubjectsForm
              editingSubjectId={editingSubjectId}
              setEditingSubjectId={setEditingSubjectId}
            />
          }
        />
      </Route>

      <Route path="/series">
        <Route
          path=""
          element={<Series setEditingSeriesId={setEditingSeriesId} />}
        />
        <Route
          path="form"
          element={
            <SeriesForm
              editingSeriesId={editingSeriesId}
              setEditingSeriesId={setEditingSeriesId}
            />
          }
        />
      </Route>

      <Route path="/classrooms">
        <Route
          path=""
          element={<Classrooms setEditingClassroomId={setEditingClassroomId} />}
        />
        <Route
          path="form"
          element={
            <ClassroomsForm
              editingClassroomId={editingClassroomId}
              setEditingClassroomId={setEditingClassroomId}
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
