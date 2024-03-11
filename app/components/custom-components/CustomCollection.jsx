import { CartForm, Image, Pagination, VariantSelector, getPaginationVariables, getSelectedProductOptions } from '@shopify/hydrogen'
import React, { Suspense } from 'react'
import {  CartProvider, useCart, ProductProvider } from '@shopify/hydrogen-react'
import { defer, json, redirect } from '@remix-run/server-runtime'
import { Await, Link, useLoaderData } from '@remix-run/react'
import Cart from '~/routes/($locale).cart'






const CustomCollection = ({ col }) => {
    const { nodes } = col
    console.log(nodes[0])
    return (
        <section className='max-w-7xl '>
            <div className="custom-section-wrapper grid ">
                <div className="number-wrapper grow-1" >2</div>
                <main className='main-section flex gap-2'>
                    <h2 className="title">Select Your Meats</h2>
                    <div className='product-and-cart flex'>
                        <div className="product-grid grid grid-cols-3">
                            {nodes.map((product, key) => (
                                <ProductCard product={product} key={key} />
                            ))}
                        </div>
                        <div className="cart-wrapper">
                           <Cart/>
                        </div>
                    </div>
                </main>

            </div>
        </section>
    )
}


function ProductCard({ product }) {
    const image = product.featuredImage.url
    const variantId = "8249959383266"
    const selectedVariant = product.variants.nodes[0]

    return (
        <div className='product-grid'>
            <div className="img-wrapper">
                <img
                    className='object-contain w-full'
                    width="100%"
                    alt={product.title}
                    src={image}
                    loading="lazy"
                />
            </div>
            <div className="price">
                <span>$ {product.priceRange.minVariantPrice.amount}</span>
            </div>
            <div className="cart">
            <Suspense
                    fallback={
                    <ProductForm
                        product={product}
                        selectedVariant={selectedVariant}
                        variants={[]}
                    />
                    }
                >
                    <Await
                    errorElement="There was a problem loading product variants"
                    resolve={product}
                    >
                    {(data) => (
                        <ProductForm
                        product={product}
                        selectedVariant={selectedVariant}
                        variants={product?.variants.nodes || []}
                        />
                    )}
                    </Await>
                </Suspense>

            </div>
        </div>
    )
}




/**
 * @param {{
*   product: ProductFragment;
*   selectedVariant: ProductFragment['selectedVariant'];
*   variants: Array<ProductVariantFragment>;
* }}
*/
export function ProductForm({product, selectedVariant, variants}) {
  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <br />
      <AddToCartButton
        // disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#cart-aside';
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'ADD TO CART'}
      </AddToCartButton>
    </div>
  );
}

/**
* @param {{option: VariantOption}}
*/
function ProductOptions({option}) {
  return (
    <div className="product-options" key={option.name}>
      <h5>{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

/**
* @param {{
*   analytics?: unknown;
*   children: React.ReactNode;
*   disabled?: boolean;
*   lines: CartLineInput[];
*   onClick?: () => void;
* }}
*/
function AddToCartButton({analytics, children, disabled, lines, onClick}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

















export default CustomCollection