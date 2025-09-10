"use strict";

import { Drawer } from "../assets/classes/Drawer.js";

const drawer = new Drawer();

const customers = document.getElementById("userId");
const memberships = document.getElementById("tbTableMemberships");

function setDataTableMembresias() {
  if ($.fn.DataTable.isDataTable("#membershipsTable")) return;

  dataTableMembresias = $("#membershipsTable").DataTable({
    dom:
      '<"d-flex justify-content-between align-items-center mb-3 px-2"<"#excelBtnDivMembresias"><"dt-search"f>>t' +
      '<"d-flex justify-content-between mx-2 row mb-1"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6 d-flex justify-content-end"p>>',
    language: { url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json" },
    pageLength: 10,
    ordering: false,
    pagingType: "simple",
    drawCallback() {
      const total = this.api().page.info().recordsTotal;
      $(".dataTables_length").hide();
      $(".dataTables_paginate").toggle(total > 10);
    },
    initComplete() {
      $("#excelBtnDivMembresias").html(`
        <i class="ri-file-excel-2-line text-success fs-1" type="button" id="downloadExcelMembresias" title="Descargar en Excel" style="cursor: pointer;"></i>
      `);

      new $.fn.dataTable.Buttons(dataTableMembresias, {
        buttons: [{
          extend: "excel",
          className: "buttons-excel",
          text: "Descargar Membresias",
          title: "Membresias",
          exportOptions: {
            // Columnas exportadas: 1 Estatus, 2 Título, 3 Desc Corta, 4 Desc Larga, 6 Clase Muestra, 7 Precio, 8 Horarios
            columns: [1, 2, 3, 4, 6, 7, 8, 9],
            format: { body: (data, row, col, node) => node?.getAttribute("data-export") || $(node).text().trim() },
          },
        }],
      });

      $("#downloadExcelMembresias").on("click", () => dataTableMembresias.button(".buttons-excel").trigger());
    },
  });
}

const getMemberships = async () => {
    let response;
    try {
        response = await fetch("/api/obtener_membresias/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error al obtener membresías:", error.message);
        alert("Error al obtener membresías: " + error.message);
        return;
    }
    const data = await response.json();
    renderMemberships(data);
};

function renderMemberships(memberships) {
    const fragment = document.createDocumentFragment();
    const tbody = document.getElementById("tbTableMemberships");
    tbody.innerHTML = "";
    memberships.forEach(membership => {
        const btnEdit = document.createElement("button");
        btnEdit.className = "btn btn-sm btn-primary me-2";
        btnEdit.textContent = "Editar";
        btnEdit.innerHTML = '<i class="ri-pencil-line"></i>';

        const btnDelete = document.createElement("button");
        btnDelete.className = "btn btn-sm btn-danger";
        btnDelete.textContent = "Eliminar";
        btnDelete.innerHTML = '<i class="ri-delete-bin-line"></i>';

        // const tr = document.createElement("tr");
        // tr.innerHTML = `
        //     <td><!-- Acciones aquí --></td>
        //     <td>Activo</td>
        //     <td>${m.username || ""}</td>
        //     <td>${m.acquired_classes || ""}</td>
        // `;
        // tbody.appendChild(tr);
        const tr = document.createElement("tr");
        const tdEstatus = document.createElement("td");
        const tdCliente = document.createElement("td");
        const tdClases = document.createElement("td");
        
        tr = drawer.drawTR(
            [btnEdit, btnDelete],

        );

        tdEstatus.textContent = "Activo"; // Aquí puedes ajustar según el estatus real
        tdCliente.textContent = membership.username || "";
        tdClases.textContent = membership.acquired_classes || "";

        // Estatus
        tr.appendChild(document.createElement("td"));
        tr.appendChild(tdEstatus);
        tr.appendChild(tdCliente);
        tr.appendChild(tdClases);

        fragment.appendChild(tr);
    });
    tbody.appendChild(fragment);
}
document.addEventListener("DOMContentLoaded", getMemberships);

const openMembershipModal = async () => {
    let response;
    try {
        response = await fetch("/api/obtener_usuarios/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error al obtener usuarios:", error.message);
        alert("Error al obtener usuarios: " + error.message);
        return;
    }
    const users = await response.json();
    fieldSelect(users);
    const membershipModal = new bootstrap.Modal(document.getElementById("modalAddMemberships"));
    membershipModal.show();
}

document.getElementById("btnAddMemberships").addEventListener("click", () => {
    openMembershipModal();
});

const membershipsForm = document.getElementById("membershipsForm");

membershipsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(membershipsForm);
    try {
        const response = await fetch("/api/agregar_membresia/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customer: customers.value,
                acquiredClasses: formData.get("acquiredClasses"),
            })
        });
        const data = await response.json();
        fieldSelect(data);
    } catch (error) {
        console.error("Error al agregar membresía:", error.message);
        alert("Error al agregar membresía: " + error.message);
    }
});

const fieldSelect = (data) => {
    const fragment = document.createDocumentFragment();
    data.forEach(element => {
        const option = document.createElement("option");
        option.value = element.id;
        option.text = `${element.username}`;
        fragment.appendChild(option);
    });
    customers.appendChild(fragment);    
};

setDataTableMembresias();
