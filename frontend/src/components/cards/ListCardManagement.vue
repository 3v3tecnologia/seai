<template>
  <div class="row">
    <div
      v-for="(item, i) in items"
      :key="getUniqueKey(item)"
      class="col-lg-3 mt-lg-4"
      :class="{ 'mt-4': i }"
    >
      <CardManagement v-bind="props" :item="item" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import CardManagement from "./CardManagement.vue";
import managementList from "@/components/cards/props/managementList";

const props = defineProps(managementList);

const getUniqueKey = (item) => item.id || item.Id;

const items = [
  {
    Id: 1,
    Plant_Name: "Tomate",
    Etr_Cycle_Total: 1,
    Etp_Cycle_Total: "2",
    Et0_Total: "3",
    Basin: "Banabuiú",
    Etp_Cycle_Maximium: "4",
    Location_Name: "Localização1",
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  },
  {
    Id: 2,
    Plant_Name: "Maçã",
    Etr_Cycle_Total: 5,
    Etp_Cycle_Total: "6",
    Et0_Total: "7",
    Basin: "Médio Jaguaribe",
    Etp_Cycle_Maximium: "8",
    Location_Name: "Localização2",
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  },
  {
    Id: 3,
    Plant_Name: "Milho de lavanda azul",
    Etr_Cycle_Total: 9,
    Etp_Cycle_Total: "10",
    Et0_Total: "11",
    Basin: "Baixo Jaguaribe",
    Etp_Cycle_Maximium: "12",
    Location_Name: "Localização3",
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  },
  {
    Id: 4,
    Plant_Name: "Uva",
    Etr_Cycle_Total: 1,
    Etp_Cycle_Total: "14",
    Et0_Total: "15",
    Basin: "Alto Jaguaribe",
    Etp_Cycle_Maximium: "16",
    Location_Name: "Localização4",
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  },
  {
    Id: 5,
    Plant_Name: "Cenoura",
    Etr_Cycle_Total: 1,
    Etp_Cycle_Total: "18",
    Et0_Total: "19",
    Basin: "Salgado",
    Etp_Cycle_Maximium: "20",
    Location_Name: "Localização5",
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  },
  {
    Id: 6,
    Plant_Name: "Batata",
    Etr_Cycle_Total: 2,
    Etp_Cycle_Total: "22",
    Et0_Total: "23",
    Basin: "Alto Jaguaribe",
    Etp_Cycle_Maximium: "24",
    Location_Name: "Localização6",
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  },
  {
    Id: 7,
    Plant_Name: "Pêssego",
    Etr_Cycle_Total: 2,
    Etp_Cycle_Total: "26",
    Et0_Total: "27",
    Basin: "Alto Jaguaribe",
    Etp_Cycle_Maximium: "28",
    Location_Name: "Localização7",
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  },
  {
    Id: 8,
    Plant_Name: "Abóbora",
    Etr_Cycle_Total: 2,
    Etp_Cycle_Total: "30",
    Et0_Total: "31",
    Basin: "Alto Jaguaribe",
    Etp_Cycle_Maximium: "32",
    Location_Name: "Localização8",
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  },
];
</script>
