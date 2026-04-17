<template>
  <div class="space-y-8 lg:space-y-10">
    <!-- Header -->
    <section
      class="monolith-shadow grid grid-cols-1 overflow-hidden bg-[var(--color-surface-container-low)] lg:grid-cols-12"
    >
      <div class="flex flex-col justify-center bg-[var(--color-surface)] p-8 sm:p-10 lg:col-span-8 lg:p-12">
        <p class="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--color-secondary)]">
          Coin Terminal
        </p>
        <h1
          class="text-3xl font-black uppercase leading-none tracking-tight text-[var(--color-primary)] sm:text-4xl md:text-5xl"
        >
          Shop
        </h1>
        <p class="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-on-surface-variant)]">
          Spend coins on skins, boosts, effects, and starter bundles. Quick add, quick cart, quick checkout.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-px bg-[rgba(66,73,78,0.2)] lg:col-span-4">
        <div
          v-for="item in overviewStats"
          :key="item.label"
          class="bg-[var(--color-surface-container-lowest)] p-6"
        >
          <p class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">
            {{ item.label }}
          </p>
          <p class="mt-3 text-2xl font-black uppercase text-[var(--color-primary)]">
            {{ item.value }}
          </p>
        </div>
      </div>
    </section>

    <!-- Controls -->
    <section class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-4 sm:p-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="tab in tabs"
            :key="tab"
            :variant="activeTab === tab ? 'solid' : 'outline'"
            color="primary"
            size="sm"
            class="uppercase tracking-[0.2em]"
            @click="activeTab = tab"
          >
            {{ tab }}
          </UButton>
        </div>

        <div class="flex items-center gap-3">
          <UButton
            color="primary"
            variant="outline"
            class="uppercase tracking-[0.2em]"
            @click="cartOpen = true"
          >
            Cart
            <span class="ml-2 text-xs font-black">({{ cartCount }})</span>
          </UButton>

          <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)] px-4 py-2">
            <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
              Wallet
            </p>
            <p class="text-sm font-black uppercase text-[var(--color-primary)]">
              {{ wallet }} Coins
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Products -->
    <section class="grid grid-cols-1 gap-8 xl:grid-cols-12">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:col-span-8">
        <div
          v-for="item in filteredProducts"
          :key="item.id"
          class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-6 transition hover:bg-[var(--color-surface-container-high)]"
        >
          <div class="mb-6 flex items-start justify-between gap-4">
            <div
              class="flex h-16 w-16 items-center justify-center border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)]"
            >
              <span class="material-symbols-outlined text-4xl text-[var(--color-primary)]">
                {{ item.icon }}
              </span>
            </div>

            <div class="flex flex-col items-end gap-2">
              <UBadge color="neutral" variant="outline" class="uppercase tracking-[0.2em]">
                {{ item.category }}
              </UBadge>
              <UBadge
                :color="item.stock > 0 ? 'success' : 'error'"
                variant="soft"
                class="uppercase tracking-[0.2em]"
              >
                {{ item.stock > 0 ? `Stock ${item.stock}` : 'Sold Out' }}
              </UBadge>
            </div>
          </div>

          <h2 class="text-xl font-black uppercase text-[var(--color-primary)]">
            {{ item.name }}
          </h2>

          <p class="mt-3 text-sm leading-6 text-[var(--color-on-surface-variant)]">
            {{ item.description }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <UBadge color="primary" variant="soft" class="uppercase tracking-[0.2em]">
              {{ item.tag }}
            </UBadge>
            <UBadge color="neutral" variant="outline" class="uppercase tracking-[0.2em]">
              {{ item.type }}
            </UBadge>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-4">
            <div class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-lowest)] p-4">
              <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Price
              </p>
              <p class="mt-2 text-lg font-black uppercase">
                {{ item.price }}
              </p>
            </div>

            <div class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-lowest)] p-4">
              <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Type
              </p>
              <p class="mt-2 text-lg font-black uppercase">
                {{ item.type }}
              </p>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between gap-4">
            <UButton
              color="primary"
              variant="outline"
              class="uppercase tracking-[0.2em]"
              @click="openProduct(item)"
            >
              Detail
            </UButton>

            <UButton
              color="primary"
              class="uppercase tracking-[0.2em]"
              :disabled="item.stock <= 0"
              @click="addToCart(item)"
            >
              Add To Cart
            </UButton>
          </div>
        </div>
      </div>

      <!-- Side -->
      <div class="space-y-8 xl:col-span-4">
        <div class="border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] p-8">
          <h3 class="mb-8 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Store Pulse
          </h3>

          <ul class="space-y-6">
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Items</span>
              <span class="text-xs font-bold text-[var(--color-primary)]">{{ products.length }}</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">In Cart</span>
              <span class="text-xs font-bold">{{ cartCount }}</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Subtotal</span>
              <span class="text-xs font-bold">{{ subtotal }}</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Wallet</span>
              <span class="text-xs font-bold">{{ wallet }}</span>
            </li>
          </ul>
        </div>

        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
          <h3 class="mb-8 text-xs font-black uppercase tracking-[0.3em]">
            Featured Picks
          </h3>

          <div class="space-y-4">
            <div
              v-for="pick in featuredPicks"
              :key="pick.id"
              class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-low)] p-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-black uppercase">
                    {{ pick.name }}
                  </p>
                  <p class="mt-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                    {{ pick.tag }}
                  </p>
                </div>
                <span class="text-xs font-black uppercase text-[var(--color-primary)]">
                  {{ pick.price }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Detail Modal -->
    <div
      v-if="productOpen"
      class="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4"
      @click.self="closeProduct"
    >
      <div
        class="w-full max-w-2xl border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface)] shadow-2xl"
      >
        <div class="border-b border-[rgba(66,73,78,0.2)] p-6 sm:p-8">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-[var(--color-secondary)]">
                Item Detail
              </p>
              <h3 class="mt-3 text-2xl font-black uppercase text-[var(--color-primary)]">
                {{ selectedProduct?.name || 'Item' }}
              </h3>
            </div>

            <UButton
              color="primary"
              variant="ghost"
              icon="i-lucide-x"
              @click="closeProduct"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 p-6 sm:grid-cols-[120px_1fr] sm:p-8">
          <div
            class="flex h-[120px] w-[120px] items-center justify-center border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)]"
          >
            <span class="material-symbols-outlined text-6xl text-[var(--color-primary)]">
              {{ selectedProduct?.icon || 'shopping_bag' }}
            </span>
          </div>

          <div class="space-y-5">
            <div class="flex flex-wrap gap-2">
              <UBadge color="primary" variant="soft" class="uppercase tracking-[0.2em]">
                {{ selectedProduct?.tag || 'Featured' }}
              </UBadge>
              <UBadge color="neutral" variant="outline" class="uppercase tracking-[0.2em]">
                {{ selectedProduct?.category || 'Skin' }}
              </UBadge>
              <UBadge color="neutral" variant="outline" class="uppercase tracking-[0.2em]">
                {{ selectedProduct?.type || 'Cosmetic' }}
              </UBadge>
            </div>

            <p class="text-sm leading-7 text-[var(--color-on-surface-variant)]">
              {{ selectedProduct?.description || 'A premium item for your competitive profile and match presence.' }}
            </p>

            <div class="grid grid-cols-2 gap-4">
              <div class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-lowest)] p-4">
                <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">Price</p>
                <p class="mt-2 text-lg font-black uppercase">{{ selectedProduct?.price || 0 }}</p>
              </div>
              <div class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-lowest)] p-4">
                <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">Stock</p>
                <p class="mt-2 text-lg font-black uppercase">{{ selectedProduct?.stock || 0 }}</p>
              </div>
            </div>

            <UButton
              color="primary"
              class="uppercase tracking-[0.2em]"
              :disabled="(selectedProduct?.stock || 0) <= 0"
              @click="selectedProduct && addToCart(selectedProduct)"
            >
              Add To Cart
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart Drawer -->
    <div
      v-if="cartOpen"
      class="fixed inset-0 z-[130] bg-black/60"
      @click.self="cartOpen = false"
    >
      <div
        class="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[rgba(66,73,78,0.2)] bg-[var(--color-surface)] shadow-2xl"
      >
        <div class="border-b border-[rgba(66,73,78,0.2)] p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-[var(--color-secondary)]">
                Cart
              </p>
              <h3 class="mt-3 text-2xl font-black uppercase text-[var(--color-primary)]">
                Checkout
              </h3>
            </div>

            <UButton
              color="primary"
              variant="ghost"
              icon="i-lucide-x"
              @click="cartOpen = false"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div
            v-if="cart.length === 0"
            class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-lowest)] p-6 text-center"
          >
            <p class="text-sm font-bold uppercase">Cart Empty</p>
            <p class="mt-3 text-xs leading-6 text-[var(--color-on-surface-variant)]">
              Add some gear and boosts to continue.
            </p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in cart"
              :key="item.id"
              class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-lowest)] p-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <p class="text-sm font-black uppercase">{{ item.name }}</p>
                  <p class="mt-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                    {{ item.price }} each
                  </p>
                </div>

                <UButton
                  color="error"
                  variant="ghost"
                  size="sm"
                  @click="removeFromCart(item.id)"
                >
                  Remove
                </UButton>
              </div>

              <div class="mt-4 flex items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                  <UButton
                    color="primary"
                    variant="outline"
                    size="xs"
                    @click="decreaseQty(item.id)"
                  >
                    -
                  </UButton>
                  <div class="min-w-[32px] text-center text-sm font-black">
                    {{ item.quantity }}
                  </div>
                  <UButton
                    color="primary"
                    variant="outline"
                    size="xs"
                    @click="increaseQty(item.id)"
                  >
                    +
                  </UButton>
                </div>

                <div class="text-sm font-black uppercase text-[var(--color-primary)]">
                  {{ item.price * item.quantity }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-[rgba(66,73,78,0.2)] p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Subtotal
              </span>
              <span class="text-sm font-black uppercase">{{ subtotal }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Wallet After
              </span>
              <span
                class="text-sm font-black uppercase"
                :class="canCheckout ? 'text-[var(--color-primary)]' : 'text-red-400'"
              >
                {{ wallet - subtotal }}
              </span>
            </div>

            <UButton
              block
              color="primary"
              class="uppercase tracking-[0.2em]"
              :disabled="!canCheckout || cart.length === 0"
              @click="checkout"
            >
              Confirm Checkout
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type TabType = 'All' | 'Skin' | 'Boost' | 'Bundle'

type ProductItem = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: 'Skin' | 'Boost' | 'Bundle'
  type: string
  tag: string
  icon: string
}

type CartItem = ProductItem & {
  quantity: number
}

const wallet = ref(4200)

const tabs: TabType[] = ['All', 'Skin', 'Boost', 'Bundle']
const activeTab = ref<TabType>('All')

const products = ref<ProductItem[]>([
  {
    id: 'SHOP-001',
    name: 'Neon Frame',
    description: 'A bright animated frame skin for profile and versus cards.',
    price: 600,
    stock: 14,
    category: 'Skin',
    type: 'Cosmetic',
    tag: 'Hot Pick',
    icon: 'crop_square'
  },
  {
    id: 'SHOP-002',
    name: 'Turbo Boost',
    description: 'A temporary score boost ticket for selected competitive events.',
    price: 300,
    stock: 25,
    category: 'Boost',
    type: 'Consumable',
    tag: 'Best Value',
    icon: 'rocket_launch'
  },
  {
    id: 'SHOP-003',
    name: 'Starter Crate',
    description: 'A mixed bundle with coins, one random badge, and one skin fragment.',
    price: 1200,
    stock: 8,
    category: 'Bundle',
    type: 'Pack',
    tag: 'Starter',
    icon: 'inventory_2'
  },
  {
    id: 'SHOP-004',
    name: 'Shadow Trail',
    description: 'Add a shadow afterimage effect to your match intro animation.',
    price: 850,
    stock: 10,
    category: 'Skin',
    type: 'Effect',
    tag: 'Style',
    icon: 'motion_photos_on'
  },
  {
    id: 'SHOP-005',
    name: 'Streak Saver',
    description: 'Protect your daily streak once if you miss a cycle.',
    price: 450,
    stock: 18,
    category: 'Boost',
    type: 'Utility',
    tag: 'Useful',
    icon: 'shield'
  },
  {
    id: 'SHOP-006',
    name: 'Arena Bundle',
    description: 'A premium pack with frame skin, boost tickets, and coin cashback.',
    price: 2200,
    stock: 5,
    category: 'Bundle',
    type: 'Premium',
    tag: 'Premium',
    icon: 'deployed_code'
  }
])

const filteredProducts = computed(() => {
  if (activeTab.value === 'All') return products.value
  return products.value.filter(item => item.category === activeTab.value)
})

const featuredPicks = computed(() => products.value.slice(0, 3))

const cart = ref<CartItem[]>([])
const productOpen = ref(false)
const cartOpen = ref(false)
const selectedProduct = ref<ProductItem | null>(null)

const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))
const subtotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
const canCheckout = computed(() => wallet.value >= subtotal.value)

const overviewStats = computed(() => [
  { label: 'Wallet', value: String(wallet.value) },
  { label: 'Items', value: String(products.value.length).padStart(2, '0') },
  { label: 'Cart', value: String(cartCount.value).padStart(2, '0') },
  { label: 'Spend', value: String(subtotal.value) }
])

function openProduct(item: ProductItem) {
  selectedProduct.value = item
  productOpen.value = true
}

function closeProduct() {
  productOpen.value = false
}

function addToCart(item: ProductItem) {
  if (item.stock <= 0) return

  const target = cart.value.find(cartItem => cartItem.id === item.id)
  if (target) {
    if (target.quantity < item.stock) {
      target.quantity += 1
    }
  } else {
    cart.value.push({
      ...item,
      quantity: 1
    })
  }

  productOpen.value = false
}

function removeFromCart(id: string) {
  cart.value = cart.value.filter(item => item.id !== id)
}

function increaseQty(id: string) {
  const target = cart.value.find(item => item.id === id)
  if (!target) return
  if (target.quantity < target.stock) {
    target.quantity += 1
  }
}

function decreaseQty(id: string) {
  const target = cart.value.find(item => item.id === id)
  if (!target) return

  if (target.quantity <= 1) {
    removeFromCart(id)
    return
  }

  target.quantity -= 1
}

function checkout() {
  if (!canCheckout.value || cart.value.length === 0) return

  wallet.value -= subtotal.value

  cart.value.forEach(cartItem => {
    const product = products.value.find(product => product.id === cartItem.id)
    if (product) {
      product.stock = Math.max(0, product.stock - cartItem.quantity)
    }
  })

  cart.value = []
  cartOpen.value = false
}

</script>