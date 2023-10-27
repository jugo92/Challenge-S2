
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Vueform } from '@vueform/vueform';

const formData = new Vueform();

const handleSubmit = ref(formData.handleSubmit);
const data = ref<any>({});
const countries = ref<any[]>([]);
const states = ref<any[]>([]);

const countryColumn = computed(() => {
  return data.value.shipping_address && data.value.shipping_address.country === 'FR' ? 4 : 6;
});

onMounted(async () => {
  const response = await fetch('https://restcountries.eu/rest/v2/all');
  const fetchedCountries = await response.json();

  countries.value = fetchedCountries.map((country: any) => {
    return {
      value: country.alpha2Code,
      label: country.name,
    };
  });
});
</script>




<template>
  <h1>Hello</h1>
  <div class="bg-white rounded-lg p-10 max-w-xl shadow-box-circle">
    <form @submit="handleSubmit">
      <FormSteps>
        <FormStep
          name="customer_information"
          label="Customer information"
          :elements="['contact_information', 'shipping_address']"
          :labels="{
            next: 'Continue to shipping method',
          }"
        />
        <FormStep
          name="shipping_method"
          label="Shipping method"
          :elements="['summary', 'shipping_method']"
          :labels="{
            next: 'Continue to payment',
            previous: 'Back'
          }"
        />

        <FormStep
          name="payment_method"
          label="Payment method"
          :elements="['summary', 'email', 'payment_method', 'billing_address', 'remember_me', 'terms']"
          :labels="{
            finish: 'Complete order',
            previous: 'Back'
          }"
        />
      </FormSteps>

      <FormElements>

        <GroupElement name="contact_information">
          <template #label>
            <div class="text-lg leading-tight mb-4 mt-4">Contact information</div>
          </template>

          <TextElement
            name="email"
            default="john@doe.com"
            placeholder="Email"
            rules="required|email:debounce=300"
          />
          <ToggleElement name="updates">
            Keep me up to date on news and exclusive offers
          </ToggleElement>
        </GroupElement>

        <GroupElement name="shipping_address">
          <template #label>
            <div class="text-lg leading-tight mb-4 mt-4">Shipping address</div>
          </template>

          <TextElement
            name="firstname"
            default="John"
            placeholder="First name (optional)"
            :columns="6"
          />
          <TextElement
            name="lastname"
            default="Doe"
            placeholder="Last name"
            rules="required"
            :columns="6"
          />
          <TextElement
            name="company"
            default="Google Inc."
            placeholder="Company (optional)"
          />
          <TextElement
            name="address"
            default="Amphitheatre Parkway 1600"
            placeholder="Address"
            rules="required"
          />
          <TextElement
            name="address2"
            placeholder="Apartment, suite, etc. (optional)"
          />
          <TextElement
            name="city"
            default="Mountain View"
            placeholder="City"
            rules="required"
          />
          <SelectElement
            name="country"
            default="US"
            placeholder="Country"
            autocomplete="new-country"
            input-type="search"
            rules="required"
            :items="countries"
            :search="true"
            :can-clear="false"
            :columns="countryColumn"
          />
          <SelectElement
            name="state"
            default="CA"
            placeholder="State"
            autocomplete="new-state"
            input-type="search"
            rules="required"
            :items="states"
            :search="true"
            :resolve-on-load="true"
            :can-clear="false"
            :columns="4"
            :conditions="[
              ['shipping_address.country', 'FR']
            ]"
          />
          <TextElement
            name="zip_code"
            default="94043"
            placeholder="ZIP code"
            rules="required"
            :columns="4"
          />
          <TextElement
            name="phone"
            default="(516)-793-8668"
            placeholder="Phone"
            rules="required"
          />
        </GroupElement>

        <StaticElement name="summary">
          <ContactComponent />
        </StaticElement>

        <RadiogroupElement
          name="shipping_method"
          rules="required"
          :items="[
            { value: 'usps', label: '<b>$66.46</b> - USPS Priority Mail Express', description: '1 business days' },
            { value: 'fedex', label: '<b>$66.98</b> - FedEx Home Delivery', description: '1 to 5 business days' },
            { value: 'ups', label: '<b>$120.82</b> - UPS Second Day Air', description: '2 business days' },
          ]"
          view="blocks"
        >
          <template #label>
            <div class="text-lg leading-tight mt-2">Shipping method</div>
          </template>
          <template #before>
            <div class="text-gray-700 mb-4">
              Please Note - Orders will be ship the next business day. Please add one shipping day to all estimates.
            </div>
          </template>
        </RadiogroupElement>

        <!-- 'Payment method' block -->
        <GroupElement name="payment_method">
          <template #label>
            <div class="text-lg leading-tight mt-2">Payment method</div>
          </template>
          <template #before>
            <div class="text-gray-700 mb-4">
              All transactions are secure and encrypted.
            </div>
          </template>

          <RadioElement
            name="credit_card"
            radio-name="payment_method"
            :add-class="{ wrapper: 'rounded-t' }"
          >
            <div class="flex justify-between items-center ml-0.5">
              <div>Credit card</div>
              <div class="flex items-center">
                <img src="/card-logos.png" class="h-6" />
              </div>
            </div>
          </RadioElement>

          <GroupElement
            name="card_details"
            add-class="bg-gray-100 p-6 -mt-4 border-l border-r border-gray-300"
            :conditions="[
              ['payment_method.credit_card', 1]
            ]"
          >
            <TextElement
              name="card_number"
              placeholder="Card number (do not enter actual card number)"
            />
            <TextElement
              name="card_name"
              placeholder="Cardholder name"
              :columns="6"
            />
            <TextElement
              name="card_date"
              placeholder="MM / YY"
              :columns="3"
            />
            <TextElement
              name="card_cvv"
              placeholder="CVV"
              :columns="3"
            />
          </GroupElement>

          <!-- 'Paypal' option -->
          <RadioElement
            name="paypal"
            radio-name="payment_method"
            :add-class="{
              container: '-mt-4 relative -top-px',
              wrapper: data.paypal ? '' : 'rounded-b',
            }"
            :rules="[{
              required: ['credit_card', null]
            }]"
            :messages="{
              required: 'Please choose a payment method.'
            }"
          >
            <div class="flex justify-between items-center ml-0.5">
              <img src="/paypal.png" class="h-6" />
              <div class="flex items-center">
                <img src="/card-logos.png" class="object-cover object-left w-30 h-6" />
              </div>
            </div>
          </RadioElement>

          <!-- Paypal info window (if selected) -->
          <StaticElement
            name="paypal_info"
            :conditions="[
              ['payment_method.paypal', 1]
            ]"
          >
            <div class="bg-gray-100 py-6 border border-gray-300 rounded-b -mt-4 relative -top-0.5">
              <div class="w-72 mx-auto text-md text-center">
                <img src="/paypal-redirect.svg" class="mx-auto mb-4" />
                After clicking "Complete order", you will be redirected to PayPal to complete your purchase securely.
              </div>
            </div>
          </StaticElement>
        </GroupElement>

        <!-- 'Billing address' block -->
        <ObjectElement name="billing_address">
          <template #label>
            <div class="text-lg leading-tight mt-2 mb-2">Billing address</div>
          </template>

          <!-- 'Same' button -->
          <RadioElement
            name="same"
            radio-name="billing"
            :add-class="{ wrapper: 'rounded-t' }"
          >
            <div class="ml-0.5">
             Same as billing address
            </div>
          </RadioElement>


          <RadioElement
            name="different"
            radio-name="billing"
            :add-class="{
              container: '-mt-4 relative -top-px',
              wrapper: data.billing_address && data.billing_address.different ? '' : 'rounded-b',
            }"
            :rules="[{
              required: ['billing_address.same', null]
            }]"
            :messages="{
              required: 'A billing address option must be selected.'
            }"
          >
            <div class="ml-0.5">
              Use a different billing address
            </div>
          </RadioElement>
          
          <!-- Billing info block (if 'use different is selected') -->
          <GroupElement
            name="billing_info"
            add-class="'bg-gray-100 p-6 -mt-4 border border-gray-300 rounded-b relative -top-0.5"
            :conditions="[
              ['billing_address.different', 1]
            ]"
          >
            <TextElement
              name="firstname"
              default="John"
              placeholder="First name (optional)"
              :columns="6"
            />
            <TextElement
              name="lastname"
              default="Doe"
              placeholder="Last name"
              rules="required"
              :columns="6"
            />
            <TextElement
              name="company"
              default="Google Inc."
              placeholder="Company (optional)"
            />
            <TextElement
              name="address"
              default="Amphitheatre Parkway 1600"
              placeholder="Address"
              rules="required"
            />
            <TextElement
              name="address2"
              placeholder="Apartment, suite, etc. (optional)"
            />
            <TextElement
              name="city"
              default="Mountain View"
              placeholder="City"
              rules="required"
            />
            <SelectElement
              name="country"
              default="US"
              placeholder="Country"
              autocomplete="new-country"
              input-type="search"
              rules="required"
              :items="countries"
              :search="true"
              :can-clear="false"
              :columns="countryColumn"
            />
            <SelectElement
              name="state"
              default="CA"
              placeholder="State"
              autocomplete="new-state"
              input-type="search"
              rules="required"
              :items="states"
              :search="true"
              :resolve-on-load="true"
              :can-clear="false"
              :columns="4"
              :conditions="[
                ['shipping_address.country', 'US']
              ]"
            />
            <TextElement
              name="zip_code"
              default="94043"
              placeholder="ZIP code"
              rules="required"
              :columns="4"
            />
          </GroupElement>
        </ObjectElement>

        <!-- 'Remember me' block -->
        <GroupElement name="remember_me">
          <template #label>
            <div class="text-lg leading-tight mt-2 mb-2">Remember me</div>
          </template>

          <!-- 'Remember me' checkbox -->
          <CheckboxElement
            name="remember"
            :add-class="{
              wrapper: `rounded-t ${data.remember ? '' : 'rounded-b'}`,
            }"
          >
            Save my information for faster checkout
          </CheckboxElement>

          <!-- 'Mobile phone number' input (if 'Remember me' is checked) -->
          <TextElement
            name="mobile_number"
            placeholder="Mobile phone number"
            rules="required"
            add-class="bg-gray-100 p-6 -mt-4 border border-gray-300 rounded-b relative -top-px"
            :conditions="[
              ['remember_me.remember', 1]
            ]"
          >
            <template #addon-before>
              <fa :icon="['fas', 'mobile-alt']"></fa>
            </template>
            <template #after>
              <div class="mt-2">
                Next time you check out here or other stores powered by Shop, Shop will send you an authorization code by SMS to securely purchase with Shop Pay.
              </div>
            </template>
          </TextElement>
        </GroupElement>

        <StaticElement name="terms" add-class="text-sm text-gray-500">
          By continuing, you agree to Shop Pay’s <a href="" class="underline">Privacy Policy</a> and <a href="" class="underline">Terms of Service</a>.
        </StaticElement>

      </FormElements>

      <FormStepsControls />
    </form>
  </div>
</template>


<!-- 
<script setup lang="ts">
import {computed, reactive, ref} from 'vue';
import {useRouter} from "vue-router";
import { z } from "zod";
import Button from "./Button.vue";
import {useToast} from "vue-toast-notification";
const router = useRouter();
const toast = useToast();

const api = 'http://localhost:3000/api';
const user = reactive({
    gender: 'H',
    firstname: '',
    lastname: '',
    usermail: '',
    confirm_usermail: '',
    password: '',
    confirm_password: '',
    birthdate: '',
    phone: '',
    address: '',
    country: 'France',
    zip: '',
    city: ''
});

const emailSchema = z.string().email({
    message: "Email invalide"
});

const passwordSchema = z.string().regex(/[a-z]/, {
    message: "Lettre minuscule manquante "
}).regex(/[A-Z]/, {
    message: "Lettre majuscule manquante"
}).regex(/\d/, {
    message: "Nombre manquant"
}).regex(/[^a-zA-Z0-9]/, {
    message: "Symbole manquant"
}).min(8, {
    message: "Mot de passe trop court (8 caractères minimum)"
});

const emailError = computed(() => {
    const parsedEmail = emailSchema.safeParse(user.usermail);
    if (parsedEmail.success) {
        return "";
    }
    return parsedEmail.error.issues[0].message;
});

const emailConfirmationError = computed(() => {
    if (user.usermail !== user.confirm_usermail) {
        return "Les emails ne correspondent pas";
    }
    return "";
});

const passwordError = computed(() => {
    const parsedPassword = passwordSchema.safeParse(user.password);
    if (parsedPassword.success) {
        return "";
    }
    return parsedPassword.error.issues[0].message;
});

const passwordConfirmationError = computed(() => {
    if (user.password !== user.confirm_password) {
        return "Les mots de passe ne correspondent pas";
    }
    return "";
});

const submitForm = async () => {
    // Perform login form submission logic here
    try {
        const response = await fetch(api + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.usermail,
                password: user.password,
                adress: user.address,
                name: user.firstname,
                lastname: user.lastname,
                gender: user.gender,
                city: user.city,
                zip: user.zip,
                phone: user.phone,
                dateofbirth: user.birthdate,
            })
        }).then((res) => res.json())
            .then((data) => {
                if (!data.hasOwnProperty('error')) {
                    router.push('/login', );
                    toast.success('Un email de confirmation vous a été envoyé');
                } else {
                    toast.error('Une erreur est survenue');
                    console.log(data);
                }
            })
    } catch (error) {
        console.error(error);
    }
};


</script>

<template>
    <div class="p-4 space-y-2 dark:bg-gray-800 dark:text-gray-100">
        <h3 class="text-base font-semibold">Étape 1: Saisissez votre email</h3>
        <h3 class="text-base font-semibold">Étape 2: Compléter votre profil</h3>
        <h3 class="text-base font-semibold">Étape 3: Confirmer votre email</h3>
        <div class="flex justify-center max-w-xs space-x-3">
            <span class="w-12 h-2 rounded-sm bg-green-500"></span>
            <span class="w-12 h-2 rounded-sm bg-green-500"></span>
            <span class="w-12 h-2 rounded-sm bg-gray-300"></span>
        </div>
    </div>
    <div class="flex items-center justify-center">
     
        <form class="card" @submit.prevent="submitForm">
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Civilité <span class="text-red-600">&nbsp;*</span></small>
                    <span class="flex justify-around">
          <span>
            <input type="radio" value="H" v-model="user.gender">&nbsp;
            <label for="H">Homme</label>
          </span>
          <span>
            <input type="radio" value="F" v-model="user.gender">&nbsp;
            <label for="F">Femme</label>
          </span>
        </span>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Date de naissance</small>
                    <input class="input" id="birthdate" type="date" v-model="user.birthdate">
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Nom <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="lastname" type="lastname" v-model="user.lastname" required autofocus>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Prénom <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="firstname" type="firstname" v-model="user.firstname" required>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Email <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="email" type="email" v-model="user.usermail" required>
                    <small class="error text-start" v-if="emailError"> {{ emailError }} </small>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Confirmer l'email <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="email-confirmation" type="email" v-model="user.confirm_usermail" required >
                    <small class="error text-start" v-if="emailConfirmationError"> {{ emailConfirmationError }} </small>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Mot de passe <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="password" type="password" v-model="user.password" required>
                    <small class="text-start" :class="{['text-red-500'] : passwordError, ['text-green-500'] : !passwordError}" v-if="passwordError"> {{ passwordError ? "invalide " + passwordError : "vallide" }} </small>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Confirmer le mot de passe <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="password-confirmation" type="password" v-model="user.confirm_password" required>
                    <small class="error" v-if="passwordConfirmationError"> {{ passwordConfirmationError }} </small>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Téléphone <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="phone" type="tel" v-model="user.phone" required>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Adresse <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="address" type="text" v-model="user.address" required>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Code postal <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="zip" type="text" v-model="user.zip" required>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Ville <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="city" type="text" v-model="user.city" required>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Pays <span class="text-red-600">&nbsp;*</span></small>
                    <select class="input" id="country" v-model="user.country" disabled>
                        <option value="France">France</option>
                    </select>
                </div>
            </div>
            <small class="flex mb-4">Vous avez déjà un compte ?&nbsp;<router-link to="/login" class="underline">Connexion</router-link></small>
            <div class="flex items-start mb-6">
                <div class="flex items-center h-5">
                    <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required>
                </div>
                <label for="remember" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    J'accepte les <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">conditions générales d'utilisation</a> et la <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">politique de confidentialité</a>.</label>
            </div>
            <button class="button button-details text-white" type="submit">VALIDER MON INSCRIPTION</button>
        </form>

    </div>
</template>

<style scoped>
</style> -->