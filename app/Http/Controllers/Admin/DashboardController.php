<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailTransaksi;
use App\Models\Transaksi;
use DateInterval;
use DatePeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        $startDate = isset($validated['start_date'])
            ? Carbon::parse($validated['start_date'])->startOfDay()
            : Carbon::today()->subDays(29)->startOfDay();

        $endDate = isset($validated['end_date'])
            ? Carbon::parse($validated['end_date'])->endOfDay()
            : Carbon::today()->endOfDay();

        if ($startDate->gt($endDate)) {
            $startDate = $endDate->copy()->subDays(29)->startOfDay();
        }

        $transactions = Transaksi::with(['user', 'detailTransaksis.produk'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $dailyGroups = $transactions->groupBy(fn (Transaksi $trx) => $trx->created_at->format('Y-m-d'));

        $period = new DatePeriod($startDate, new DateInterval('P1D'), $endDate->copy()->addDay());

        $revenueChart = collect(iterator_to_array($period))
            ->map(fn (\DateTimeInterface $date) => [
                'label' => Carbon::parse($date)->format('d M'),
                'value' => $dailyGroups->get(Carbon::parse($date)->format('Y-m-d'), collect([]))->sum('total_harga'),
            ])
            ->values();

        $salesTrend = collect(iterator_to_array($period))
            ->map(fn (\DateTimeInterface $date) => [
                'label' => Carbon::parse($date)->format('d M'),
                'value' => $dailyGroups->get(Carbon::parse($date)->format('Y-m-d'), collect([]))->count(),
            ])
            ->values();

        $details = DetailTransaksi::with('produk')
            ->whereHas('transaksi', function ($query) use ($startDate, $endDate): void {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->get();

        $productGroups = $details
            ->groupBy(fn (DetailTransaksi $detail) => $detail->produk?->nama ?? 'Produk Terhapus')
            ->map(fn ($group, $name) => [
                'nama' => $name,
                'qty' => $group->sum('jumlah'),
                'revenue' => $group->sum('subtotal'),
                'profit' => $group->first()?->produk
                    ? ($group->first()->produk->harga_jual - $group->first()->produk->harga_beli)
                    : 0,
                'transactions' => $group->pluck('id_transaksi')->unique()->count(),
            ]);

        $bestSellingProducts = $productGroups
            ->sortByDesc(fn ($item) => $item['qty'])
            ->values()
            ->take(5);

        $worstSellingProducts = $productGroups
            ->sortBy(fn ($item) => $item['qty'])
            ->values()
            ->take(5);

        $bestProfitProducts = $productGroups
            ->sortByDesc(fn ($item) => $item['profit'])
            ->values()
            ->take(5);

        $topSalesDates = $dailyGroups
            ->map(fn ($group, $date) => [
                'label' => Carbon::parse($date)->format('d M Y'),
                'value' => $group->count(),
            ])
            ->sortByDesc(fn ($item) => $item['value'])
            ->values()
            ->take(5);

        $topSalesHours = $transactions
            ->groupBy(fn (Transaksi $trx) => $trx->created_at->format('H:00'))
            ->map(fn ($group, $hour) => [
                'label' => $hour,
                'value' => $group->count(),
            ])
            ->sortByDesc(fn ($item) => $item['value'])
            ->values()
            ->take(8);

        $cashierGroups = $transactions
            ->groupBy(fn (Transaksi $trx) => $trx->user?->name ?? 'User Terhapus')
            ->map(fn ($group, $name) => [
                'nama' => $name,
                'transactions' => $group->count(),
                'revenue' => $group->sum('total_harga'),
            ])
            ->values();

        $topCashiersByTransactions = $cashierGroups
            ->sortByDesc(fn ($item) => $item['transactions'])
            ->values()
            ->take(5);

        $topCashiersByRevenue = $cashierGroups
            ->sortByDesc(fn ($item) => $item['revenue'])
            ->values()
            ->take(5);

        $cashierAchievements = $cashierGroups
            ->sortByDesc(fn ($item) => $item['transactions'])
            ->values()
            ->take(8);

        $totalRevenue = $transactions->sum('total_harga');
        $totalTransactions = $transactions->count();
        $totalItemsSold = $details->sum('jumlah');
        $averageOrderValue = $totalTransactions > 0 ? (int) floor($totalRevenue / $totalTransactions) : 0;

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_transactions' => $totalTransactions,
                'average_order_value' => $averageOrderValue,
                'total_items_sold' => $totalItemsSold,
            ],
            'revenue_chart' => $revenueChart,
            'sales_trend' => $salesTrend,
            'best_selling_products' => $bestSellingProducts,
            'worst_selling_products' => $worstSellingProducts,
            'top_sales_dates' => $topSalesDates,
            'top_sales_hours' => $topSalesHours,
            'cashier_achievements' => $cashierAchievements,
            'best_profit_products' => $bestProfitProducts,
            'top_cashiers_by_transactions' => $topCashiersByTransactions,
            'top_cashiers_by_revenue' => $topCashiersByRevenue,
            'date_range' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
        ]);
    }
}
