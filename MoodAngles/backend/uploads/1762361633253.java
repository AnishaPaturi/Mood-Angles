import java.util.*;

class dpFib
{
	static int count;
	static int fibR(int n)
	{
		count++;
		if(n <= 1)
			return n;
		return fibR(n - 1) + fibR(n - 2);
	}

	public static int fibMem(int n, Map<Integer,Integer> map){
		count++;
		if(n <= 1)
			return n;

		if(map.containsKey(n))
			return map.get(n);

		Integer fibN = fibMem(n-1, map) + fibMem(n-2, map);
		map.put(n, fibN);

		return fibN; 
	}

	static int fibDP(int n){
		count++;
		int dp[] = new int[n + 1];
		dp[0] = 0;
		dp[1] = 1;

		for (int i= 2; i <= n; i++)
			dp[i] = dp[i-1] + dp[i-2];

		System.out.println("fib DP count: " + Arrays.toString(dp));

		return dp[n];
	}

	static int fib(int n)
	{
		// Memoized version to find fibonacci series
		// To speed up we store the values of calculated states
		HashMap<Integer, Integer> memoizedMap = new HashMap<>();

        memoizedMap.put(0, 0);
        memoizedMap.put(1, 1);

        return fibMem(n, memoizedMap);
	}

	public static void main(String args[])
	{
		Scanner sc=new Scanner(System.in);
		int n = sc.nextInt();
		System.out.println(dpFib.fibR(n));
		System.out.println("fib Recur count: " + count);
		count = 0;
		System.out.println(dpFib.fib(n));
		System.out.println("fib Mem count: " + count);
		count = 0;
		System.out.println(dpFib.fibDP(n));
		System.out.println("fib DP count: " + count);
	}
}