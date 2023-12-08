<template>
  <Modal
      title="Demande de retour"
      content="formBuilder"
      :show="isRefundModalVisible"
      @close="closeRefundModal"
      :formConfig="refundConfig"
  />
  <Modal
      title="Changement de mot de passe"
      content="formBuilder"
      :show="isResetPasswordModalVisible"
      @close="closeResetPasswordModal"
      :formConfig="resetPasswordForm"
  />
  <div class="w-5/6  mx-auto">
    <!--      Informations personnels et Adresses-->
    <div class="grid xl:grid-cols-2 gap-8 mb-12">
      <div class="w-full">
        <span class="text-2xl text-black flex items-center"><Icon icon="ic:baseline-perm-identity" width="" /> &nbsp <label>Informations personnels </label></span>
        <div class="card text-black">
          <div class="grid grid-cols-2 h-16 ">
            <p class="font-bold flex items-center">Nom complet</p>
            <p class="flex items-center"> {{ user.firstname + ' ' + user.lastname}}</p>
          </div>
          <hr>
          <div class="grid grid-cols-2 h-16 ">
            <p class="font-bold flex items-center">Adresse e-mail</p>
            <p class="flex items-center"> {{ user.email}}</p>
          </div>
          <hr>
          <div class="grid grid-cols-2 h-16">
            <p class="font-bold flex items-center">Identifiant utilisateur</p>
            <p class="flex items-center"> {{ user.id}}</p>
          </div>
          <hr class="">
          <div class="grid grid-cols-2 h-16">
            <p class="font-bold flex items-center">Mot de passe</p>
            <p class="flex items-center underline cursor-pointer p-0" @click="openResetPasswordModal"> Changer le mot de passe</p>
          </div>
        </div>
      </div>

      <div class="w-full">
        <span class="text-2xl text-black flex items-center"><Icon icon="entypo:address" width="" /> &nbsp <label>Adresses </label></span>
        <div class="card text-black">
          <div class="grid grid-cols-2 h-16">
            <p class="font-bold flex items-center">Adresse de facturation</p>
            <p class="flex items-center"> {{ user.address }}<br>{{ user.zip + " " + user.city }}</p>
          </div>
          <hr>
          <div class="grid grid-cols-2 h-16 ">
            <p class="font-bold flex items-center">Adresse de livraison</p>
            <p class="flex items-center"> {{ user.address }}<br>{{ user.zip + " " + user.city }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid xl:grid-cols-2 gap-8 mb-12">
      <div class="w-full">
        <span class="text-2xl text-black flex items-center"><Icon icon="mdi:bell" width="" /> &nbsp <label>Mes notifications </label></span>
        <div class="card text-black">
          <div class="flex gap-8">
            <div class="flex items-center">
              <input type="checkbox">
            </div>
            <div class="flex flex-col justify-center">
              <p class="font-bold flex items-center">Newsletters</p>
              <p class="flex items-center">Abonnez-vous à notre newsletter dès maintenant pour recevoir régulièrement des actualités, des promotions exclusives et des offres spéciales directement dans votre boîte de réception. Soyez parmi les premiers informés de nos nouveautés !</p>
            </div>
          </div>
          <br>
          <div class="flex gap-8">
            <div class="flex items-center">
              <input type="checkbox">
            </div>
            <div class="flex flex-col justify-center">
              <p class="font-bold flex items-center">Restockage des produits</p>
              <p class="flex items-center">Soyez alerté(e) dès que vos produits préférés sont de retour en stock ! Inscrivez-vous aux notifications de restockage et recevez un message instantané dès que les articles que vous attendiez sont disponibles à l'achat.</p>
            </div>
          </div>
          <br>
          <div class="flex gap-8">
            <div class="flex items-center">
              <input type="checkbox">
            </div>
            <div class="flex flex-col justify-center">
              <p class="font-bold flex items-center">Nouveau produit</p>
              <p class="flex items-center">Ne manquez jamais les dernières tendances ! Activez les notifications pour être averti(e) à chaque fois qu'un nouveau produit passionnant est ajouté à la catégorie [Nom de la Catégorie]. Restez à jour et explorez nos nouveautés dès qu'elles arrivent.</p>
            </div>
          </div>
          <br>
          <div class="flex gap-8">
            <div class="flex items-center">
              <input type="checkbox">
            </div>
            <div class="flex flex-col justify-center">
              <p class="font-bold flex items-center">Changement de prix</p>
              <p class="flex items-center">Votre expérience shopping est importante pour nous. Abonnez-vous aux notifications de changement de prix pour être informé(e) en temps réel de toute modification tarifaire sur vos articles préférés. Restez informé(e) et continuez à profiter des meilleures offres.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <span class="text-2xl text-black">Adresses</span>
        <div class="card text-black">
          <div class="grid grid-cols-2 h-16">
            <p class="font-bold flex items-center">Adresse de facturation</p>
            <p class="flex items-center"> {{ user.address }}<br>{{ user.zip + " " + user.city }}</p>
          </div>
          <hr>
          <div class="grid grid-cols-2 h-16 ">
            <p class="font-bold flex items-center">Adresse de livraison</p>
            <p class="flex items-center"> {{ user.address }}<br>{{ user.zip + " " + user.city }}</p>
          </div>
        </div>
      </div>
    </div>

    <!--      Historique de commande-->
    <div class="w-full mb-12">
      <span class="text-2xl text-black flex items-center"><Icon icon="fluent-mdl2:reservation-orders" width="" /> &nbsp <label>Remboursement et retour </label></span>
      <template v-for="order in orders">
        <div class="card text-black h-52 mt-2">
          <div class="grid grid-cols-6 h-full ">
            <template v-for="(product, index) in order.Products" class="flex flex-wrap gap-5 hidden">
              <div class="col-span-1">

                        <span class="gap-1">
                            <span class="flex items-center gap-2">
                            <Icon icon="mingcute:box-fill" />
                            <p>Produit n°{{index+1}}</p>
                            </span>
                            <p class="font-bold">Statut de la commande</p>
                            <img src="https://picsum.photos/200/100" alt="#">
                        </span>

              </div>
            </template>
            <div class="text-black flex flex-wrap grid grid-cols-2 col-span-2 col-end-7">
                        <span class="flex flex-col justify-between items-center h-full">
                            <div class="flex">
                                <Icon icon="mingcute:calendar-line" width="30" />
                                <div class="pl-2">
                                    <p class="font-bold">Date de la commande</p>
                                    <p>xxxxxxxxxx</p>
                                </div>
                            </div>
                            <Button @click="openModalRefund(order._id)" content="Demander un retour" :redirect="false" color="white" :id="order._id"/>
                        </span>
              <span class="flex flex-col justify-between items-center h-full">
                            <div class="flex border-l-2 pl-14">
                                <Icon icon="solar:box-outline" width="30" />
                                <div class="pl-2">
                                    <p class="font-bold">N° de commande</p>
                                    <p>{{ order._id.replace("-", "").substring(0, 10) }}</p>
                                </div>
                            </div>
                          <span class="flex">
                            <Button content="Détails de la commande" :redirect="false" color="yellow" action=""/>
                          </span>
                        </span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!--      Remboursements et retours-->
    <div class="w-full">
      <span class="text-2xl text-black flex items-center"><Icon icon="gridicons:refund" width="" /> &nbsp <label>Remboursement et retour </label></span>
      <TableBuilder :data="tableData" :columns="tableColumns"  @open="openModalInstance" :update="fetchListOfItems" :pageIndex="pageIndex"/>
    </div>
  </div>

</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {apiService} from "../../services/apiService";
import Button from "../Button.vue";
import {Icon} from "@iconify/vue";
import Modal from "../Modal/Modal.vue";
import {useModal} from "../Modal/useModal.ts";
import {useTable} from "../Table/tableHelper.ts";
import {z} from "zod";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import TableBuilder from "../Table/TableBuilder.vue";
import TabBuilder from "../Table/TableBuilder.vue";

const router = useRouter();
const store = useStore();
// const { isModalVisible, openModal, closeModal } = useModal();
const { isModalVisible: isRefundModalVisible, openModal: openRefundModal, closeModal: closeRefundModal } = useModal();
const { isModalVisible: isResetPasswordModalVisible, openModal: openResetPasswordModal, closeModal: closeResetPasswordModal } = useModal();
const { getTableColumns, fetchListOfItems, tableData, pageIndex } = useTable();
const sendRefund = () => {
  const refund = {
    OrderId: refundConfig.value.find(field => field.name === "orderId").value,
    UserId: refundConfig.value.find(field => field.name === "userId").value,
    motif: refundConfig.value.find(field => field.name === "motif").value,
  }
  apiService.create("refunds", refund)
      .then((response) => {
        closeRefundModal();
        setTimeout(() => {
          fetchListOfItems("refunds", "UserId="+userId);
        }, 500);
      })
      .catch((error) => {
        console.error(error);
      });
}


const onSubmit = async (data) => {
  try {
    await store.dispatch('resetPassword', data);
    router.push('/login');
  } catch (e) {
    console.error(e);
  }
};

const refundConfig = ref([
  {
    name: 'orderId',
    value: '',
    showCondition: () => false
  },
  {
    name: 'userId',
    value: '',
    showCondition: () => false
  },
  {
    type: "textarea",
    name: "motif",
    label: "Motif de retour",
    placeholder: "Saisissez le motif de votre retour",
    required: true,
    value: "",
    validationError: "",
    validationSchema: z.string()
        .min(10, "Le motif doit contenir au moins 10 caractères")
        .max(500, "Limites de caractères atteinte")
  },
  {
    type: "button",
    name: "submit",
    label: "Envoyer",
    buttonClass: 'bg-blue-500 mt-4 text-white',
    required: true,
    buttonClick: sendRefund,
  },
])

const openModalRefund = (orderId) => {
  refundConfig.value.find(field => field.name === "orderId").value = orderId;
  refundConfig.value.find(field => field.name === "userId").value = userId;
  openRefundModal();
}

const openModalResetPassword = () => {
  openResetPasswordModal();
}

const resetPasswordForm = ref([
  {
    label: "Ancien mot de passe",
    type: "password",
    name: "oldpassword",
    value: '',
    validationError: "",
    validationSchema: z.string()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
        .max(255, { message: "Le mot de passe doit contenir au maximum 255 caractères" }),
  },
  {
    label: "Nouveau mot de passe",
    type: "password",
    name: "newpassword",
    value: '',
    validationError: "",
    validationSchema: z.string()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
        .max(255, { message: "Le mot de passe doit contenir au maximum 255 caractères" }),
  },
  {
    label: "Confirmation du nouveau mot de passe",
    type: "password",
    name: "newpasswordconfirm",
    value: '',
    validationError: "",
    validationSchema: z.string()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
        .max(255, { message: "Le mot de passe doit contenir au maximum 255 caractères" }),
  },
  {
    type: 'button',
    label: 'Enregistrer',
    buttonType: 'button',
    buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
    buttonClick: openModalResetPassword,
  }
]);

const userId = window.location.pathname.substring(1).split("/")[2]
const user = ref({})
const orders = ref([])

const tableColumns = getTableColumns("refunds")

onMounted(() => {
  apiService.getOne("users", userId)
      .then((response) => {
        user.value = response;
        return apiService.getAll("/orders", "?email=" + user.value.email);
      })
      .then((response) => {
        orders.value = response;
      })
      .catch((error) => {
        console.error(error);
      });
  fetchListOfItems("refunds", "UserId="+userId);
});

</script>

<style>
@import "./../../assets/styles.css";


</style>