import axios from "axios";
import React, { useEffect, useState } from "react";

import { Button, Container, Navbar, Table } from "react-bootstrap";
import { CgUnblock } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Home() {
  const [data, setData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const addData = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/show`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        if (err?.response?.data?.authorised === false) {
          checkAuthorization();
        }
      });
  };
  const checkAuthorization = () => {
    axios(`${process.env.REACT_APP_API_URL}/api/checkauth`, {
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        setLoggedIn(true);
      })
      .catch((err) => {
        setLoggedIn(false);
        localStorage.removeItem("token");
        toast.error("You're not authorised");
        navigate("/login");
      });
  };
  useEffect(() => {
    document.title = "Home | Task #4";
    checkAuthorization();
    addData();
  }, []);

  const handleChangeSelect = async (e) => {
    const { name, checked } = e.target;
    if (name === "selectall") {
      const checkedValue = data.map((each) => ({
        ...each,
        isChecked: checked,
      }));
      setData(checkedValue);
    } else {
      console.log(name);
      const checkedValue = data.map((each) =>
        each.id == name ? { ...each, isChecked: checked } : { ...each }
      );
      setData(checkedValue);
    }
  };
  const getSelectedIds = () => {
    const selectedIds = [];
    data.forEach((each) => {
      if (each.isChecked) {
        selectedIds.push(each.id);
      }
    });
    return selectedIds;
  };
  const handleDelete = (e) => {
    e.preventDefault();
    const selectedIds = getSelectedIds();
    if (selectedIds.length == 0) {
      toast.error("You haven't selected anything.");
      return;
    }

    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/delete`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: { id: selectedIds },
      })
      .then((res) => {
        checkAuthorization();
        addData();
        toast.success(`Selected users are setted deleted succesfully.`);
      })
      .catch((err) => {
        if (err?.response?.data?.authorised === false) {
          checkAuthorization();
        }
      });
  };

  const handleUpdate = (e, upd) => {
    e.preventDefault();
    const selectedIds = getSelectedIds();
    if (selectedIds.length == 0) {
      toast.error("You haven't selected anything.");
      return;
    }

    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/api/update`,
        { id: selectedIds, upd: upd },
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        checkAuthorization();
        addData();
        toast.success(`Selected users are setted ${upd} succesfully.`);
      })
      .catch((err) => {
        if (err?.response?.data?.authorised === false) {
          checkAuthorization();
        }
      });
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    toast.info("You're logged out.");
    navigate("/login");
  };
  return (
    loggedIn && (
      <>
        <Navbar className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#home">Task #4</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <Button onClick={logout}>Logout</Button>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="container my-5 py-md-5">
          <div className="row">
            <div className="col-md-12 text-start d-flex mb-3 gap-2">
              <Button
                variant="danger"
                onClick={(e) => handleUpdate(e, "Blocked")}
              >
                Block
              </Button>
              <Button onClick={(e) => handleUpdate(e, "Active")}>
                <CgUnblock />
              </Button>
              <Button onClick={handleDelete}>
                <MdDelete />
              </Button>
            </div>
            <Table striped="row" className="border" responsive>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      name="selectall"
                      checked={!data.some((each) => each?.isChecked !== true)}
                      onChange={handleChangeSelect}
                    />
                  </th>
                  <th>
                    Name <br /> <small className="text-xs">Position</small>
                  </th>
                  <th>Email</th>
                  <th>Last Login</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((each) => (
                  <tr key={each.id}>
                    <td>
                      <input
                        type="checkbox"
                        name={each.id}
                        id=""
                        checked={each?.isChecked || false}
                        onChange={handleChangeSelect}
                      />
                    </td>
                    <td>
                      <span className="lead">{each.name}</span> <br />
                      <small>{each.position}</small>
                    </td>
                    <td>{each.email}</td>
                    <td>{each.last_login}</td>
                    <td>{each.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </>
    )
  );
}
